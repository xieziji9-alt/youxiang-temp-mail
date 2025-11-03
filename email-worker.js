/**
 * Cloudflare Email Worker
 * 用于接收发送到 *.xieziji.shop 的邮件
 * 
 * 部署方式：
 * 1. 在 Cloudflare Dashboard → Email → Email Routing
 * 2. 启用 Email Routing
 * 3. 创建 Email Worker，粘贴此代码
 */

export default {
  async email(message, env, ctx) {
    // 解析邮件信息
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get('subject') || '(无主题)';
    
    // 获取邮件内容
    const rawEmail = await new Response(message.raw).text();
    
    // 解析邮件正文（简单版本）
    let textContent = '';
    let htmlContent = '';
    
    try {
      // 尝试获取纯文本内容
      if (message.text) {
        textContent = await new Response(message.text).text();
      }
      
      // 尝试获取 HTML 内容
      if (message.html) {
        htmlContent = await new Response(message.html).text();
      }
    } catch (e) {
      console.error('解析邮件内容失败:', e);
    }
    
    // 构造邮件数据
    const emailData = {
      id: crypto.randomUUID(),
      from: from,
      to: to,
      subject: subject,
      text: textContent || '(无内容)',
      html: htmlContent,
      receivedAt: new Date().toISOString(),
      raw: rawEmail.substring(0, 10000) // 限制大小
    };
    
    // 发送到你的 API 端点
    try {
      // 方式1: 发送到你的 Pages 应用的 API
      const apiUrl = `https://xieziji.shop/api/emails`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Email-Worker': 'true', // 验证请求来源
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        console.log('邮件已转发到 API:', to);
      } else {
        console.error('转发邮件失败:', response.status);
      }
    } catch (error) {
      console.error('发送邮件到 API 失败:', error);
    }
    
    // 方式2: 存储到 Cloudflare KV（可选）
    // 如果你配置了 KV namespace，可以直接存储
    if (env.EMAIL_STORAGE) {
      try {
        // 使用收件人地址作为 key 的一部分
        const key = `email:${to}:${emailData.id}`;
        await env.EMAIL_STORAGE.put(key, JSON.stringify(emailData), {
          expirationTtl: 3600 // 1小时后过期
        });
        console.log('邮件已存储到 KV:', key);
      } catch (error) {
        console.error('存储到 KV 失败:', error);
      }
    }
    
    // 方式3: 转发到其他邮箱（可选）
    // await message.forward("your-real-email@example.com");
  }
}

