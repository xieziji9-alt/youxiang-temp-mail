/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages Functions 环境类型定义
 */
declare global {
  // Cloudflare Pages Function 类型
  type PagesFunction<Env = unknown> = (context: {
    request: Request;
    env: Env;
    params: Record<string, string>;
    waitUntil: (promise: Promise<any>) => void;
    next: () => Promise<Response>;
    data: Record<string, any>;
  }) => Response | Promise<Response>;
}

export {};

