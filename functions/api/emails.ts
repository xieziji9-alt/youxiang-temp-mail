/**
 * Cloudflare Pages Function - 邮件 API
 * 路径: /api/emails
 * 
 * 这个文件会自动部署为 Cloudflare Pages Function
 * 替代 Next.js 的 API Routes
 */

interface Env {
  EMAIL_STORAGE: KVNamespace;
}

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  receivedAt: string;
}

// GET /api/emails?address=xxx@xieziji.shop
// 获取指定邮箱地址的所有邮件
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const address = url.searchParams.get('address');
  
  if (!address) {
    return new Response(JSON.stringify({ error: '缺少 address 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // 从 KV 中获取邮件
    const emails: Email[] = [];
    
    if (context.env.EMAIL_STORAGE) {
      // 列出所有匹配的邮件
      const prefix = `email:${address}:`;
      const list = await context.env.EMAIL_STORAGE.list({ prefix });
      
      // 获取每封邮件的详细内容
      for (const key of list.keys) {
        const emailJson = await context.env.EMAIL_STORAGE.get(key.name);
        if (emailJson) {
          emails.push(JSON.parse(emailJson));
        }
      }
      
      // 按时间倒序排序
      emails.sort((a, b) => 
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
    }
    
    return new Response(JSON.stringify(emails), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('获取邮件失败:', error);
    return new Response(JSON.stringify({ error: '获取邮件失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST /api/emails
// 接收新邮件（由 Email Worker 调用）
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const emailData = await context.request.json() as Email;
    
    // 验证请求来源
    const workerHeader = context.request.headers.get('X-Email-Worker');
    if (workerHeader !== 'true') {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 存储到 KV
    if (context.env.EMAIL_STORAGE) {
      const key = `email:${emailData.to}:${emailData.id}`;
      await context.env.EMAIL_STORAGE.put(key, JSON.stringify(emailData), {
        expirationTtl: 3600 // 1小时后自动删除
      });
    }
    
    return new Response(JSON.stringify({ success: true, id: emailData.id }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('接收邮件失败:', error);
    return new Response(JSON.stringify({ error: '接收邮件失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE /api/emails?id=xxx
// 删除指定邮件
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return new Response(JSON.stringify({ error: '缺少 id 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    if (context.env.EMAIL_STORAGE) {
      // 查找并删除邮件
      const list = await context.env.EMAIL_STORAGE.list();
      for (const key of list.keys) {
        if (key.name.endsWith(`:${id}`)) {
          await context.env.EMAIL_STORAGE.delete(key.name);
          break;
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('删除邮件失败:', error);
    return new Response(JSON.stringify({ error: '删除邮件失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// OPTIONS - CORS 预检请求
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Email-Worker',
    }
  });
};

