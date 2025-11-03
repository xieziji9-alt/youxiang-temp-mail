import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type Email = {
  id: string;
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  receivedAt: string;
  isRead: boolean;
};

// In-memory store for local development only
const emailStore = new Map<string, Email[]>();

// GET /api/emails
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: '\u90ae\u7bb1\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a' },
      { status: 400 },
    );
  }

  const emails = emailStore.get(address) ?? [];
  return NextResponse.json(emails);
}

type IncomingEmail = {
  to?: string;
  from?: string;
  subject?: string;
  text?: string;
  html?: string;
};

// POST /api/emails
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IncomingEmail;
    const { to, from, subject, text, html } = body;

    if (!to) {
      return NextResponse.json(
        { error: '\u6536\u4ef6\u4eba\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a' },
        { status: 400 },
      );
    }

    const email: Email = {
      id: Date.now().toString(),
      to,
      from: from ?? 'unknown@example.com',
      subject: subject ?? '(\u65e0\u4e3b\u9898)',
      text: text ?? html ?? '',
      html,
      receivedAt: new Date().toISOString(),
      isRead: false,
    };

    const emails = emailStore.get(to) ?? [];
    emails.unshift(email);

    if (emails.length > 50) {
      emails.splice(50);
    }

    emailStore.set(to, emails);

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('\u5904\u7406\u90ae\u4ef6\u5931\u8d25:', error);
    return NextResponse.json({ error: '\u5904\u7406\u90ae\u4ef6\u5931\u8d25' }, { status: 500 });
  }
}

// DELETE /api/emails
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const emailId = searchParams.get('id');

  if (!address || !emailId) {
    return NextResponse.json(
      { error: '\u53c2\u6570\u4e0d\u5b8c\u6574' },
      { status: 400 },
    );
  }

  const emails = emailStore.get(address) ?? [];
  const filteredEmails = emails.filter((email) => email.id !== emailId);
  emailStore.set(address, filteredEmails);

  return NextResponse.json({ success: true });
}
