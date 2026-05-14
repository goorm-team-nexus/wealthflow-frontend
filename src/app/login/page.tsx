import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 sm:bg-gray-50">
      <div className="w-full max-w-[400px]">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-[32px] font-bold tracking-tight text-[#0f172a]">WealthFlow</h1>
          <p className="mt-1 text-[15px] text-gray-500">
            모든 자산을 WealthFlow로 한번에 관리하세요
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">로그인</h2>

          <form className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="m@example.com"
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <p className="mt-1.5 text-xs text-red-500">이메일 형식을 맞춰주세요 m@example.com</p>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm text-gray-900 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Login & Signup Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                className="w-full rounded-lg bg-[#171717] py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
              >
                로그인
              </button>
              <Link
                href="/signup"
                className="flex w-full justify-center rounded-lg bg-[#f4f4f5] py-2.5 text-[15px] font-medium text-gray-900 transition-colors hover:bg-[#e4e4e7]"
              >
                회원가입
              </Link>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-xs text-gray-400">OR</span>
              </div>
            </div>

            {/* Kakao Login Button */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-[#FDD800]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 2C4.029 2 0 5.166 0 9.071C0 11.597 1.614 13.805 4.093 15.068L3.219 18.291C3.155 18.528 3.424 18.711 3.626 18.577L7.494 15.992C7.981 16.096 8.483 16.143 9 16.143C13.971 16.143 18 12.978 18 9.071C18 5.166 13.971 2 9 2Z"
                  fill="#000000"
                />
              </svg>
              카카오 로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
