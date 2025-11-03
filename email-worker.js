/**
 * Cloudflare Email Worker
 * Receives messages sent to *.xieziji.shop and forwards them to the Pages API / KV.
 *
 * Deployment steps:
 * 1. Cloudflare Dashboard -> Email -> Email Routing
 * 2. Create an Email Worker and paste this code
 */

export default {
  async email(message, env, ctx) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get('subject') || '(\u65e0\u4e3b\u9898)';

    const rawEmail = await new Response(message.raw).text();

    let textContent = '';
    let htmlContent = '';

    try {
      if (message.text) {
        textContent = await new Response(message.text).text();
      }

      if (message.html) {
        htmlContent = await new Response(message.html).text();
      }
    } catch (error) {
      console.error('\u89e3\u6790\u90ae\u4ef6\u5185\u5bb9\u5931\u8d25:', error);
    }

    const emailData = {
      id: crypto.randomUUID(),
      from,
      to,
      subject,
      text: textContent || htmlContent || '',
      html: htmlContent,
      receivedAt: new Date().toISOString(),
      raw: rawEmail.substring(0, 10_000),
    };

    // Option 1: forward to Pages API
    try {
      // 转发到 Pages 应用的 API
      const apiUrl = 'https://xieziji.shop/api/emails';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Email-Worker': 'true',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        console.log('\u90ae\u4ef6\u5df2\u8f6c\u53d1\u5230 API:', to);
      } else {
        console.error('\u8f6c\u53d1\u90ae\u4ef6\u5931\u8d25:', response.status);
      }
    } catch (error) {
      console.error('\u53d1\u9001\u90ae\u4ef6\u5230 API \u5931\u8d25:', error);
    }

    // Option 2: store directly in KV
    if (env.EMAIL_STORAGE) {
      try {
        const key = `email:${to}:${emailData.id}`;
        await env.EMAIL_STORAGE.put(key, JSON.stringify(emailData), {
          expirationTtl: 86400, // 24 hours
        });
        console.log('\u90ae\u4ef6\u5df2\u5b58\u50a8\u81f3 KV:', key);
      } catch (error) {
        console.error('\u5b58\u50a8 KV \u5931\u8d25:', error);
      }
    }

    // Option 3: forward to another mailbox if needed
    // await message.forward('your-real-email@example.com');
  },
};

