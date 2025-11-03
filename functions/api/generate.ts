/**
 * Cloudflare Pages Function - 生成邮箱地址 API
 * 路径: /api/generate
 */

interface Env {}

// POST /api/generate
// 生成随机邮箱地址
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    const subdomain = body.subdomain || 'cheyu';
    const baseDomain = 'xieziji.shop';
    
    // 生成随机字符串
    const randomString = Math.random().toString(36).substring(2, 8) + 
                        Math.random().toString(36).substring(2, 8);
    
    const email = `${randomString}@${subdomain}.${baseDomain}`;
    
    return new Response(JSON.stringify({ email }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('生成邮箱失败:', error);
    return new Response(JSON.stringify({ error: '生成邮箱失败' }), {
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};

