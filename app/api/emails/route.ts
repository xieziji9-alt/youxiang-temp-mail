import { NextRequest, NextResponse } from 'next/server'

// 内存存储邮件（生产环境应使用数据库）
const emailStore = new Map<string, any[]>()

// 获取邮件列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: '邮箱地址不能为空' }, { status: 400 })
  }

  const emails = emailStore.get(address) || []
  return NextResponse.json(emails)
}

// 定义邮件接收的数据类型
interface IncomingEmail {
  to: string
  from?: string
  subject?: string
  content?: string
  html?: string
}

// 接收新邮件（用于邮件服务器回调）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as IncomingEmail
    const { to, from, subject, content, html } = body

    if (!to) {
      return NextResponse.json({ error: '收件人地址不能为空' }, { status: 400 })
    }

    const email = {
      id: Date.now().toString(),
      from: from || 'unknown@example.com',
      subject: subject || '(无主题)',
      content: content || html || '',
      receivedAt: new Date().toISOString(),
      isRead: false
    }

    const emails = emailStore.get(to) || []
    emails.unshift(email)
    
    // 只保留最近50封邮件
    if (emails.length > 50) {
      emails.splice(50)
    }
    
    emailStore.set(to, emails)

    return NextResponse.json({ success: true, email })
  } catch (error) {
    return NextResponse.json({ error: '处理邮件失败' }, { status: 500 })
  }
}

// 删除邮件
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')
  const emailId = searchParams.get('id')

  if (!address || !emailId) {
    return NextResponse.json({ error: '参数不完整' }, { status: 400 })
  }

  const emails = emailStore.get(address) || []
  const filteredEmails = emails.filter(email => email.id !== emailId)
  emailStore.set(address, filteredEmails)

  return NextResponse.json({ success: true })
}

