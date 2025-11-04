import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

type Email = {
  id: string
  to: string
  from: string
  subject: string
  text: string
  html?: string
  receivedAt: string
  isRead: boolean
}

// 内存存储（仅用于本地开发和演示）
const emailStore = new Map<string, Email[]>()

// GET /api/emails?address=xxx@xieziji.shop
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { error: '缺少 address 参数' },
      { status: 400 }
    )
  }

  try {
    // 从内存存储获取邮件
    const emails = emailStore.get(address) || []
    
    return NextResponse.json(emails, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('获取邮件失败:', error)
    return NextResponse.json(
      { error: '获取邮件失败' },
      { status: 500 }
    )
  }
}

// POST /api/emails
// 接收新邮件（用于邮件服务器回调）
export async function POST(request: NextRequest) {
  try {
    const workerHeader = request.headers.get('X-Email-Worker')
    if (workerHeader !== 'true') {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    interface IncomingEmail {
      id: string
      to: string
      from?: string
      subject?: string
      text?: string
      html?: string
      receivedAt?: string
    }

    const body = await request.json() as IncomingEmail
    const { id, to, from, subject, text, html, receivedAt } = body

    if (!id || !to) {
      return NextResponse.json(
        { error: '缺少邮件标识或收件人地址' },
        { status: 400 }
      )
    }

    const email: Email = {
      id,
      to,
      from: from || 'unknown@example.com',
      subject: subject || '(无主题)',
      text: text || html || '',
      html,
      receivedAt: receivedAt || new Date().toISOString(),
      isRead: false,
    }

    // 存储到内存
    const emails = emailStore.get(to) || []
    emails.unshift(email) // 新邮件放在最前面
    
    // 限制每个邮箱最多保存 50 封邮件
    if (emails.length > 50) {
      emails.splice(50)
    }
    
    emailStore.set(to, emails)

    return NextResponse.json(
      { success: true, id: email.id },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('接收邮件失败:', error)
    return NextResponse.json(
      { error: '接收邮件失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/emails?address=xxx&id=yyy
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const id = searchParams.get('id')

  if (!address || !id) {
    return NextResponse.json(
      { error: '缺少 address 或 id 参数' },
      { status: 400 }
    )
  }

  try {
    const emails = emailStore.get(address) || []
    const filteredEmails = emails.filter(email => email.id !== id)
    emailStore.set(address, filteredEmails)

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('删除邮件失败:', error)
    return NextResponse.json(
      { error: '删除邮件失败' },
      { status: 500 }
    )
  }
}

// OPTIONS - CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Email-Worker',
    },
  })
}

