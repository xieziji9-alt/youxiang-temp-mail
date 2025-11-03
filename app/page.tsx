'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw, Copy, Check, Inbox, Clock, Trash2 } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  receivedAt: string;
  isRead: boolean;
}

// Email domains for temporary mailbox
const EMAIL_DOMAINS = [
  'xieziji.shop',
  'cheyu.xieziji.shop',
  'yumail.xieziji.shop',
  'tempmail.xieziji.shop',
  'mail.xieziji.shop',
] as const;

const MOCK_EMAIL: Email = {
  id: 'mock-1',
  from: 'service@example.com',
  subject: '\u6b22\u8fce\u4f7f\u7528\u4e34\u65f6\u90ae\u7bb1\u670d\u52a1',
  text: [
    '\u8fd9\u662f\u4e00\u5c01\u6d4b\u8bd5\u90ae\u4ef6\u3002\u60a8\u7684\u4e34\u65f6\u90ae\u7bb1\u5df2\u7ecf\u51c6\u5907\u5c31\u7eea\uff01',
    '',
    '\u4f7f\u7528\u8bf4\u660e\uff1a',
    '1. \u590d\u5236\u4e0a\u65b9\u7684\u90ae\u7bb1\u5730\u5740',
    '2. \u5728\u9700\u8981\u63a5\u6536\u9a8c\u8bc1\u7801\u7684\u7f51\u7ad9\u4f7f\u7528\u8be5\u5730\u5740',
    '3. \u90ae\u4ef6\u4f1a\u81ea\u52a8\u663e\u793a\u5728\u8fd9\u91cc',
    '4. \u90ae\u4ef6\u4f1a\u572824\u5c0f\u65f6\u540e\u81ea\u52a8\u5220\u9664',
    '',
    '\u6ce8\u610f\uff1a\u8bf7\u52ff\u4f7f\u7528\u4e34\u65f6\u90ae\u7bb1\u6ce8\u518c\u91cd\u8981\u8d26\u53f7\u3002',
  ].join('\n'),
  receivedAt: new Date().toISOString(),
  isRead: false,
};

export default function Home() {
  const [selectedDomain, setSelectedDomain] =
    useState<(typeof EMAIL_DOMAINS)[number]>(EMAIL_DOMAINS[0]);
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate a random email address
  const generateEmail = useCallback(() => {
    const randomString =
      Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    const address = `${randomString}@${selectedDomain}`;
    setEmailAddress(address);
    setEmails([]);
    setSelectedEmail(null);
  }, [selectedDomain]);

  // Copy email address to clipboard
  const copyEmail = useCallback(async () => {
    if (!emailAddress) return;
    await navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [emailAddress]);

  // Fetch latest emails
  const refreshEmails = useCallback(async () => {
    if (!emailAddress) return;

    try {
      const response = await fetch(`/api/emails?address=${encodeURIComponent(emailAddress)}`);
      if (!response.ok) {
        throw new Error(`\u8bf7\u6c42\u5931\u8d25: ${response.status}`);
      }

      const data = (await response.json()) as unknown;
      if (!Array.isArray(data)) {
        throw new Error('\u8fd4\u56de\u6570\u636e\u683c\u5f0f\u4e0d\u6b63\u786e');
      }

      const normalizedEmails: Email[] = data.map((item) => ({
        id: String(item.id ?? Date.now()),
        from: typeof item.from === 'string' ? item.from : 'unknown@example.com',
        subject: typeof item.subject === 'string' ? item.subject : '(\u65e0\u4e3b\u9898)',
        text:
          typeof item.text === 'string'
            ? item.text
            : typeof item.html === 'string'
            ? item.html
            : '',
        html: typeof item.html === 'string' ? item.html : undefined,
        receivedAt:
          typeof item.receivedAt === 'string' ? item.receivedAt : new Date().toISOString(),
        isRead: Boolean(item.isRead),
      }));

      setEmails(normalizedEmails);
      setSelectedEmail((current) => {
        if (!current) {
          return normalizedEmails[0] ?? null;
        }
        return normalizedEmails.find((email) => email.id === current.id) ?? normalizedEmails[0] ?? null;
      });
    } catch (error) {
      console.error('\u83b7\u53d6\u90ae\u4ef6\u5931\u8d25:', error);
      setEmails((current) => (current.length === 0 ? [MOCK_EMAIL] : current));
    }
  }, [emailAddress]);

  // Delete an email
  const deleteEmail = useCallback(
    async (id: string) => {
      if (!emailAddress) return;

      const previousEmails = emails;
      const nextEmails = previousEmails.filter((email) => email.id !== id);
      setEmails(nextEmails);
      setSelectedEmail((current) => (current?.id === id ? null : current));

      try {
        const response = await fetch(
          `/api/emails?address=${encodeURIComponent(emailAddress)}&id=${encodeURIComponent(id)}`,
          { method: 'DELETE' },
        );

        if (!response.ok) {
          throw new Error(`\u5220\u9664\u5931\u8d25: ${response.status}`);
        }
      } catch (error) {
        console.error('\u5220\u9664\u90ae\u4ef6\u5931\u8d25:', error);
        setEmails(previousEmails);
        setSelectedEmail((current) => {
          if (current) {
            return current;
          }
          return previousEmails.find((email) => email.id === id) ?? null;
        });
      }
    },
    [emailAddress, emails],
  );

  // Auto refresh mail box
  useEffect(() => {
    if (!autoRefresh || !emailAddress) {
      return;
    }

    const interval = setInterval(() => {
      refreshEmails().catch((error) => console.error('\u81ea\u52a8\u5237\u65b0\u5931\u8d25:', error));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, emailAddress, refreshEmails]);

  // Generate an email on mount and whenever the subdomain changes
  useEffect(() => {
    generateEmail();
  }, [generateEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-500 p-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Yu Mail</h1>
          </div>
          <div className="text-sm text-gray-600">
            {'\u4e34\u65f6\u90ae\u7bb1\u0020\u00b7\u0020\u4fdd\u62a4\u9690\u79c1'}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Generator */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {'\u751f\u6210\u4e34\u65f6\u90ae\u7bb1'}
          </h2>

          {/* Domain selection */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {'\u9009\u62e9\u90ae\u7bb1\u57df\u540d'}
            </label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {EMAIL_DOMAINS.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`rounded-lg border-2 px-4 py-2 transition-all ${
                    selectedDomain === domain
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  @{domain}
                </button>
              ))}
            </div>
          </div>

          {/* Email display */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-lg">
              {emailAddress || '\u70b9\u51fb\u751f\u6210\u90ae\u7bb1\u5730\u5740'}
            </div>
            <button
              onClick={copyEmail}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              <span>{copied ? '\u5df2\u590d\u5236' : '\u590d\u5236'}</span>
            </button>
            <button
              onClick={generateEmail}
              className="flex items-center space-x-2 rounded-lg bg-gray-500 px-4 py-3 text-white transition-colors hover:bg-gray-600"
            >
              <RefreshCw className="h-5 w-5" />
              <span>{'\u6362\u4e00\u4e2a'}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <label htmlFor="auto-refresh" className="flex items-center space-x-2">
                <input
                  id="auto-refresh"
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(event) => setAutoRefresh(event.target.checked)}
                />
                <span>{'\u81ea\u52a8\u5237\u65b0\uff08\u0035\u0020\u79d2\uff09'}</span>
              </label>
            </div>
            <button
              onClick={() => refreshEmails()}
              className="flex items-center space-x-2 text-blue-500 transition-colors hover:text-blue-600"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{'\u7acb\u5373\u5237\u65b0'}</span>
            </button>
          </div>
        </div>

        {/* Mail list + content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Mail list */}
          <div className="lg:col-span-1 rounded-lg bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Inbox className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">{'\u6536\u4ef6\u7bb1'}</h3>
                <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                  {emails.length}
                </span>
              </div>
              <button
                onClick={() => refreshEmails()}
                className="text-blue-500 transition-colors hover:text-blue-600"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[600px] divide-y divide-gray-200 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>{'\u6ca1\u6709\u90ae\u4ef6'}</p>
                  <p className="mt-1 text-sm">{'\u7b49\u5f85\u63a5\u6536\u90ae\u4ef6\u002e\u002e\u002e'}</p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                      selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <p className="flex-1 truncate text-sm font-medium text-gray-900">{email.from}</p>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteEmail(email.id);
                        }}
                        className="ml-2 text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mb-1 truncate text-sm font-medium text-gray-700">{email.subject}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(email.receivedAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mail content */}
          <div className="lg:col-span-2 rounded-lg bg-white shadow-md">
            {selectedEmail ? (
              <div className="p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">{selectedEmail.subject}</h3>
                <div className="mb-4 border-b border-gray-200 pb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">{'\u53d1\u4ef6\u4eba'}</p>
                      <p className="font-medium text-gray-900">{selectedEmail.from}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{'\u63a5\u6536\u65f6\u95f4'}</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedEmail.receivedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedEmail.html ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-gray-700">{selectedEmail.text}</p>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-gray-500">
                <div className="text-center">
                  <Mail className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="text-lg">{'\u9009\u62e9\u4e00\u5c01\u90ae\u4ef6\u67e5\u770b\u5185\u5bb9'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

