import { TabBar } from "@/components/shared/TabBar";

export default function FindPw() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-white px-4 pt-10 pb-20 sm:bg-gray-50">
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

        {/* Find Password / Reset Password Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-8">
          <h2 className="mb-8 text-xl font-bold text-gray-900">비밀번호 재설정</h2>

          <form className="space-y-8">
            {/* Email Field (Static/Readonly as per image style) */}
            <div className="space-y-3">
              <label className="block text-[15px] font-bold text-gray-900">
                이메일
              </label>
              <div className="px-4 py-2 text-lg text-gray-900">
                xxxx@gmail.com
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-3">
              <label
                htmlFor="password"
                className="block text-[15px] font-bold text-gray-900"
              >
                새 비밀번호
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="block w-full rounded-xl border border-gray-100 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900"
              />
            </div>

            {/* Password Confirm Field */}
            <div className="space-y-3">
              <label
                htmlFor="passwordConfirm"
                className="block text-[15px] font-bold text-gray-900"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="passwordConfirm"
                placeholder="********"
                className="block w-full rounded-xl border border-gray-100 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                className="w-full rounded-xl bg-[#171717] py-4 text-[16px] font-bold text-white transition-colors hover:bg-black"
              >
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tab Bar */}
      <TabBar />
    </div>
  );
}
