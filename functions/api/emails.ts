/**
 * Cloudflare Pages Function - 邮件 API (ASCII-escaped)
 * Path: /api/emails
 *
 * This file is deployed as a Cloudflare Pages Function
 * replacing the Next.js API routes when running on Pages.
 */

interface Env {
  EMAIL_STORAGE: KVNamespace;
}

type Email = {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  receivedAt: string;
};

type StoredEmail = Email;

// GET /api/emails?address=xxx@xieziji.shop
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const address = url.searchParams.get('address');

  if (!address) {
    return new Response(JSON.stringify({ error: '\u7f3a\u5c11 address \u53c2\u6570' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const emails: StoredEmail[] = [];

    if (context.env.EMAIL_STORAGE) {
      const prefix = `email:${address}:`;
      const list = await context.env.EMAIL_STORAGE.list({ prefix });

      for (const key of list.keys) {
        const emailJson = await context.env.EMAIL_STORAGE.get(key.name);

        if (emailJson) {
          try {
            const parsed = JSON.parse(emailJson) as StoredEmail;
            emails.push(parsed);
          } catch (parseError) {
            console.error('\u89e3\u6790\u90ae\u4ef6\u5931\u8d25:', parseError, key.name);
          }
        }
      }

      emails.sort(
        (a, b) =>
          new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
      );
    }

    return new Response(JSON.stringify(emails), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('\u83b7\u53d6\u90ae\u4ef6\u5931\u8d25:', error);
    return new Response(JSON.stringify({ error: '\u83b7\u53d6\u90ae\u4ef6\u5931\u8d25' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/emails
// Receives new emails forwarded by the Email Worker
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const workerHeader = context.request.headers.get('X-Email-Worker');
    if (workerHeader !== 'true') {
      return new Response(JSON.stringify({ error: '\u672a\u6388\u6743' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawEmail = (await context.request.json()) as Partial<StoredEmail>;

    if (!rawEmail.id || !rawEmail.to) {
      return new Response(
        JSON.stringify({ error: '\u7f3a\u5c11\u90ae\u4ef6\u6807\u8bc6\u6216\u6536\u4ef6\u4eba\u5730\u5740' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const email: StoredEmail = {
      id: rawEmail.id,
      to: rawEmail.to,
      from: rawEmail.from ?? 'unknown@example.com',
      subject: rawEmail.subject ?? '(\u65e0\u4e3b\u9898)',
      text: rawEmail.text ?? rawEmail.html ?? '',
      html: rawEmail.html,
      receivedAt: rawEmail.receivedAt ?? new Date().toISOString(),
    };

    if (context.env.EMAIL_STORAGE) {
      const key = `email:${email.to}:${email.id}`;
      await context.env.EMAIL_STORAGE.put(key, JSON.stringify(email), {
        expirationTtl: 86400, // 24 hours
      });
    }

    return new Response(JSON.stringify({ success: true, id: email.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('\u63a5\u6536\u90ae\u4ef6\u5931\u8d25:', error);
    return new Response(JSON.stringify({ error: '\u63a5\u6536\u90ae\u4ef6\u5931\u8d25' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE /api/emails?address=xxx&id=yyy
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const address = url.searchParams.get('address');
  const id = url.searchParams.get('id');

  if (!address || !id) {
    return new Response(
      JSON.stringify({ error: '\u7f3a\u5c11 address \u6216 id \u53c2\u6570' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    if (context.env.EMAIL_STORAGE) {
      const prefix = `email:${address}:`;
      const list = await context.env.EMAIL_STORAGE.list({ prefix });
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
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('\u5220\u9664\u90ae\u4ef6\u5931\u8d25:', error);
    return new Response(JSON.stringify({ error: '\u5220\u9664\u90ae\u4ef6\u5931\u8d25' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// OPTIONS - CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Email-Worker',
    },
  });
};

