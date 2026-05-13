export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 sm:bg-gray-50">
      <div className="w-full max-w-[400px]">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-[32px] font-bold tracking-tight text-[#0f172a]">
            WealthFlow
          </h1>
          <p className="mt-1 text-[15px] text-gray-500">
            모든 자산을 WealthFlow로 한번에 관리하세요
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">회원가입</h2>

          <form className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-[15px] font-bold text-gray-900"
              >
                이름
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Email Field & Verification Button */}
            <div className="space-y-2">
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
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-500 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  className="rounded-lg bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  인증요청
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[15px] font-bold text-gray-900"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-500 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호는 영문, 숫자, 특수문자 조합으로 9자리를 입력하세요
              </p>
            </div>

            {/* Password Confirm Field */}
            <div className="space-y-2">
              <label
                htmlFor="passwordConfirm"
                className="block text-[15px] font-bold text-gray-900"
              >
                비밀번호 재입력
              </label>
              <input
                type="password"
                id="passwordConfirm"
                placeholder="********"
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-500 outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호가 다릅니다
              </p>
            </div>

            {/* Signup Button */}
            <div className="pt-4">
              <button
                type="button"
                className="w-full rounded-lg bg-[#171717] py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-black"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
