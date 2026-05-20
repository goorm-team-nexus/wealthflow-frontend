"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CorsTestPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: "success" | "error" | null;
    method: string;
    url: string;
    errorType?: string;
    errorMessage?: string;
    data?: unknown;
    headers?: Record<string, string>;
  }>({
    status: null,
    method: "",
    url: "",
  });

  const handleDirectFetch = async () => {
    setLoading(true);
    const targetUrl = `https://d3uib3r331utfe.cloudfront.net/api/v1/market/stocks/${ticker.toUpperCase().trim()}`;

    try {
      // Direct fetch from browser to backend
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      // Extract some response headers for display
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const data = await response.json();

      setResult({
        status: "success",
        method: "GET",
        url: targetUrl,
        data,
        headers,
      });
    } catch (err: unknown) {
      console.error("Direct fetch error:", err);
      setResult({
        status: "error",
        method: "GET",
        url: targetUrl,
        errorType: (err instanceof Error ? err.name : null) || "TypeError",
        errorMessage:
          (err instanceof Error ? err.message : null) ||
          "Failed to fetch (CORS block or network issue)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-2xl">
        <Card className="border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
              >
                Network Sandbox
              </Badge>
              <Link href="/login" className="text-xs text-muted-foreground hover:underline">
                로그인 페이지로 이동
              </Link>
            </div>
            <CardTitle className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              CORS / Direct API Connection Test
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              브라우저에서 백엔드 API 서버로 직접 요청을 보내 CORS(Cross-Origin Resource Sharing)
              설정 상태를 테스트합니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="ticker"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                조회할 주식 티커 심볼 (Ticker Symbol)
              </label>
              <div className="flex gap-3">
                <Input
                  id="ticker"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="예: AAPL, TSLA, MSFT"
                  className="max-w-[200px]"
                  disabled={loading}
                />
                <Button
                  onClick={handleDirectFetch}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  {loading ? "요청 중..." : "백엔드 직접 호출 (Browser ➔ API)"}
                </Button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                호출 대상 URL:{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  https://d3uib3r331utfe.cloudfront.net/api/v1/market/stocks/{"{"}ticker{"}"}
                </code>
              </p>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                테스트 결과
              </h3>

              {result.status === null && (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
                  위 버튼을 눌러 테스트를 시작해 주세요.
                </div>
              )}

              {result.status === "success" && (
                <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      ✓
                    </span>
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                      CORS 허용됨 / API 직접 호출 성공
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p>
                      <strong>요청 URL:</strong>{" "}
                      <code className="font-mono text-slate-600 dark:text-slate-300">
                        {result.url}
                      </code>
                    </p>
                    <p>
                      <strong>메서드:</strong> <code className="font-mono">{result.method}</code>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Response Data:</span>
                    <pre className="max-h-60 overflow-y-auto rounded bg-slate-900 p-3 font-mono text-xs text-emerald-400">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {result.status === "error" && (
                <div className="space-y-4 rounded-lg border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/30 dark:bg-rose-950/20">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                      ✗
                    </span>
                    <h4 className="font-semibold text-rose-800 dark:text-rose-300">
                      CORS 차단됨 또는 네트워크 에러 발생
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>요청 URL:</strong> <code className="font-mono">{result.url}</code>
                    </p>
                    <p>
                      <strong>에러 타입:</strong>{" "}
                      <code className="font-mono text-rose-600 dark:text-rose-400">
                        {result.errorType}
                      </code>
                    </p>
                    <p>
                      <strong>에러 메시지:</strong>{" "}
                      <code className="font-mono text-rose-600 dark:text-rose-400">
                        {result.errorMessage}
                      </code>
                    </p>
                  </div>

                  <div className="rounded-md bg-rose-100/50 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                    <p className="font-medium mb-1">💡 상세 분석:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        브라우저 개발자 도구(F12)의 <strong>Console</strong> 또는{" "}
                        <strong>Network</strong> 탭에서 정확한 차단 사유를 확인하실 수 있습니다.
                      </li>
                      <li>
                        대부분의 경우 백엔드의{" "}
                        <code className="font-mono">Access-Control-Allow-Origin</code> 응답 헤더가
                        프런트엔드 도메인(<code className="font-mono">http://localhost:3000</code>{" "}
                        등)을 포함하지 않아 브라우저 보안에 의해 차단됩니다.
                      </li>
                      <li>
                        이러한 CORS 제약 때문에 로그인, 리프레시 토큰 처리 등 보안과 쿠키가 중요한
                        핵심 API는 Next.js BFF 프록시 방식으로 경유하여 통신하도록 설계하는 것이
                        일반적입니다.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>WealthFlow Frontend Sandbox Environment</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
