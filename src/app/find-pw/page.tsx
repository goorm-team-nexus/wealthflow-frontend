'use client';

export default function FindPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 sm:bg-gray-50">
      <div className="w-full max-w-[400px]">
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-[32px] font-bold tracking-tight text-[#0f172a]">
            WealthFlow
          </h1>
          <p className="mt-1 text-[15px] text-gray-400">
            모든 자산을 WealthFlow로 한번에 관리하세요
          </p>
        </div>

        {/* Find Password Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
          <h2 className="mb-8 text-lg font-bold text-gray-900">비밀번호 찾기</h2>

          <form className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2.5">
              <label
                htmlFor="name"
                className="block text-[15px] font-bold text-gray-900"
              >
                이름
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <label
                htmlFor="email"
                className="block text-[15px] font-bold text-gray-900"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                placeholder="xxxx@gmail.com"
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <p className="mt-1.5 text-xs text-red-500">
                이메일 형식을 맞춰주세요 m@example.com
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full rounded-xl bg-[#111111] py-4 text-[15px] font-medium text-white transition-colors hover:bg-black"
              >
                이메일 보내기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
