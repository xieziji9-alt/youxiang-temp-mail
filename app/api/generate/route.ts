import { NextRequest, NextResponse } from 'next/server'

// 定义请求体类型
interface GenerateEmailRequest {
  domain: string
}

// 生成随机邮箱地址
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateEmailRequest
    const { domain } = body

    if (!domain) {
      return NextResponse.json({ error: '域名不能为空' }, { status: 400 })
    }

    // 生成随机字符串
    const randomString = Math.random().toString(36).substring(2, 8) + 
                        Math.random().toString(36).substring(2, 8)
    
    const emailAddress = `${randomString}@${domain}`

    return NextResponse.json({ 
      success: true, 
      email: emailAddress 
    })
  } catch (error) {
    return NextResponse.json({ error: '生成邮箱失败' }, { status: 500 })
  }
}

