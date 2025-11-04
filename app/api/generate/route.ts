import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface GenerateEmailRequest {
  subdomain?: string
}

// POST /api/generate
// 生成随机邮箱地址
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateEmailRequest
    const subdomain = body.subdomain || 'cheyu'
    const baseDomain = 'xieziji.shop'
    
    // 生成随机字符串
    const randomString = Math.random().toString(36).substring(2, 8) + 
                        Math.random().toString(36).substring(2, 8)
    
    const email = `${randomString}@${subdomain}.${baseDomain}`
    
    return NextResponse.json(
      { email },
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('生成邮箱失败:', error)
    return NextResponse.json(
      { error: '生成邮箱失败' },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// OPTIONS - CORS 预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

