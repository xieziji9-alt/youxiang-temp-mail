/**
 * Cloudflare Email Worker - 改进版
 * Receives messages sent to *.xieziji.shop and forwards them to the Pages API / KV.
 *
 * 改进点：
 * 1. 更好的内容提取逻辑
 * 2. 详细的日志记录
 * 3. 从 raw 邮件中提取内容作为后备方案
 */

export default {
  async email(message, env, ctx) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get('subject') || '(无主题)';

    console.log('📧 收到邮件:', { from, to, subject });

    // 读取原始邮件
    const rawEmail = await new Response(message.raw).text();
    console.log('📄 原始邮件长度:', rawEmail.length);

    let textContent = '';
    let htmlContent = '';

    try {
      // 尝试读取纯文本内容
      if (message.text) {
        const textStream = message.text;
        textContent = await new Response(textStream).text();
        console.log('✅ 纯文本内容长度:', textContent.length);
      } else {
        console.log('⚠️ 没有纯文本内容');
      }

      // 尝试读取 HTML 内容
      if (message.html) {
        const htmlStream = message.html;
        htmlContent = await new Response(htmlStream).text();
        console.log('✅ HTML 内容长度:', htmlContent.length);
      } else {
        console.log('⚠️ 没有 HTML 内容');
      }

      // 如果两者都为空，尝试从 raw 中提取
      if (!textContent && !htmlContent && rawEmail) {
        console.log('🔍 尝试从原始邮件中提取内容...');
        
        // 方法1: 查找邮件正文部分（在空行之后）
        const parts = rawEmail.split(/\r?\n\r?\n/);
        if (parts.length > 1) {
          // 跳过邮件头，获取正文
          const bodyPart = parts.slice(1).join('\n\n');
          textContent = bodyPart.trim();
          console.log('✅ 从 raw 提取的内容长度:', textContent.length);
        }
        
        // 方法2: 如果还是空的，尝试查找 Content-Type 之后的内容
        if (!textContent) {
          const contentMatch = rawEmail.match(/Content-Type: text\/plain[\s\S]*?\r?\n\r?\n([\s\S]+?)(?:\r?\n--|\r?\n\r?\n--|\Z)/i);
          if (contentMatch) {
            textContent = contentMatch[1].trim();
            console.log('✅ 从 Content-Type 提取的内容长度:', textContent.length);
          }
        }
      }

      // 最后的后备方案：如果还是没有内容，使用原始邮件的一部分
      if (!textContent && !htmlContent) {
        console.log('⚠️ 无法提取内容，使用原始邮件');
        textContent = rawEmail.substring(0, 1000);
      }

    } catch (error) {
      console.error('❌ 解析邮件内容失败:', error);
      // 即使失败也要保存邮件，使用原始内容
      textContent = `解析失败，原始内容：\n${rawEmail.substring(0, 1000)}`;
    }

    const emailData = {
      id: crypto.randomUUID(),
      from,
      to,
      subject,
      text: textContent || '(邮件内容为空)',
      html: htmlContent || undefined,
      receivedAt: new Date().toISOString(),
      raw: rawEmail.substring(0, 10_000),
    };

    console.log('📦 邮件数据:', {
      id: emailData.id,
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      textLength: emailData.text.length,
      hasHtml: !!emailData.html,
    });

    // Option 1: forward to Pages API
    try {
      const apiUrl = 'https://xieziji.shop/api/emails';

      console.log('🚀 转发到 API:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Email-Worker': 'true',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ 邮件已转发到 API:', to, result);
      } else {
        const errorText = await response.text();
        console.error('❌ 转发邮件失败:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ 发送邮件到 API 失败:', error);
    }

    // Option 2: store directly in KV
    if (env.EMAIL_STORAGE) {
      try {
        const key = `email:${to}:${emailData.id}`;
        await env.EMAIL_STORAGE.put(key, JSON.stringify(emailData), {
          expirationTtl: 86400, // 24 hours
        });
        console.log('✅ 邮件已存储至 KV:', key);
      } catch (error) {
        console.error('❌ 存储 KV 失败:', error);
      }
    } else {
      console.log('⚠️ EMAIL_STORAGE 未配置');
    }
  },
};

