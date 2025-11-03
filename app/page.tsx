'use client'

import { useState, useEffect } from 'react'
import { Mail, RefreshCw, Copy, Check, Inbox, Clock, Trash2 } from 'lucide-react'

interface Email {
  id: string
  from: string
  subject: string
  content: string
  receivedAt: string
  isRead: boolean
}

// xieziji.shop 的不同三级域名
const SUBDOMAINS = [
  'cheyu',
  'yumail',
  'tempmail',
  'mail',
  'temp',
  'inbox',
  'email',
  'box',
  'msg'
]

const BASE_DOMAIN = 'xieziji.shop'

export default function Home() {
  const [selectedSubdomain, setSelectedSubdomain] = useState(SUBDOMAINS[0])
  const [emailAddress, setEmailAddress] = useState('')
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [copied, setCopied] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // 生成随机邮箱地址
  const generateEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 8) +
                        Math.random().toString(36).substring(2, 8)
    const fullDomain = `${selectedSubdomain}.${BASE_DOMAIN}`
    setEmailAddress(`${randomString}@${fullDomain}`)
    setEmails([])
    setSelectedEmail(null)
  }

  // 复制邮箱地址
  const copyEmail = async () => {
    if (emailAddress) {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 刷新邮件列表
  const refreshEmails = async () => {
    if (!emailAddress) return

    try {
      const response = await fetch(`/api/emails?address=${emailAddress}`)
      if (response.ok) {
        const data = await response.json() as Email[]
        setEmails(data)
      }
    } catch (error) {
      console.error('获取邮件失败:', error)
      // 如果API调用失败，显示示例邮件
      if (emails.length === 0) {
        const mockEmails: Email[] = [
          {
            id: '1',
            from: 'service@example.com',
            subject: '欢迎使用临时邮箱服务',
            content: '这是一封测试邮件。您的临时邮箱已经准备就绪！\n\n使用说明：\n1. 复制上方的邮箱地址\n2. 在需要接收验证码的网站使用该地址\n3. 邮件会自动显示在这里\n4. 邮件会在24小时后自动删除\n\n注意：请勿使用临时邮箱注册重要账号。',
            receivedAt: new Date().toISOString(),
            isRead: false
          }
        ]
        setEmails(mockEmails)
      }
    }
  }

  // 删除邮件
  const deleteEmail = (id: string) => {
    setEmails(emails.filter(email => email.id !== id))
    if (selectedEmail?.id === id) {
      setSelectedEmail(null)
    }
  }

  // 自动刷新
  useEffect(() => {
    if (autoRefresh && emailAddress) {
      const interval = setInterval(refreshEmails, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, emailAddress])

  // 初始化时生成邮箱
  useEffect(() => {
    generateEmail()
  }, [selectedSubdomain])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Yu Mail</h1>
            </div>
            <div className="text-sm text-gray-600">
              临时邮箱 · 保护隐私
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 邮箱生成区域 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">生成临时邮箱</h2>
          
          {/* 三级域名选择 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择三级域名
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SUBDOMAINS.map((subdomain) => (
                <button
                  key={subdomain}
                  onClick={() => setSelectedSubdomain(subdomain)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedSubdomain === subdomain
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  @{subdomain}.{BASE_DOMAIN}
                </button>
              ))}
            </div>
          </div>

          {/* 邮箱地址显示 */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-lg">
              {emailAddress || '点击生成邮箱地址'}
            </div>
            <button
              onClick={copyEmail}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? '已复制' : '复制'}</span>
            </button>
            <button
              onClick={generateEmail}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>换一个</span>
            </button>
          </div>
        </div>

        {/* 邮件列表和内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 邮件列表 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Inbox className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">收件箱</h3>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {emails.length}
                </span>
              </div>
              <button
                onClick={refreshEmails}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>没有邮件</p>
                  <p className="text-sm mt-1">等待接收邮件...</p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate flex-1">
                        {email.from}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteEmail(email.id)
                        }}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-medium truncate mb-1">
                      {email.subject}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(email.receivedAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 邮件内容 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            {selectedEmail ? (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedEmail.subject}
                </h3>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-600">发件人</p>
                      <p className="font-medium text-gray-900">{selectedEmail.from}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">接收时间</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedEmail.receivedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEmail.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-gray-500">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">选择一封邮件查看内容</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

