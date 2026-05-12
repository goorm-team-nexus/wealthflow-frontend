import { TabBar } from "@/components/shared/TabBar";

export default function EditInfo() {
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

        {/* Edit Info Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-8">
          <h2 className="mb-8 text-xl font-bold text-gray-900">내 정보 수정</h2>

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
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition-colors focus:border-gray-900"
              />
            </div>

            {/* Password Change Field */}
            <div className="space-y-2.5">
              <label
                htmlFor="password"
                className="block text-[15px] font-bold text-gray-900"
              >
                비밀번호 변경
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900"
              />
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호는 영문, 숫자, 특수문자 조합으로 9자리를 입력하세요
              </p>
            </div>

            {/* Password Re-enter Field */}
            <div className="space-y-2.5">
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
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900"
              />
              <p className="mt-1.5 text-xs text-red-500">
                비밀번호가 다릅니다
              </p>
            </div>

            {/* Email Field (Static) */}
            <div className="space-y-2.5">
              <label className="block text-[15px] font-bold text-gray-900">
                이메일
              </label>
              <div className="px-4 py-2 text-lg text-gray-900">
                xxxx@gmail.com
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                className="w-full rounded-xl bg-[#171717] py-4 text-[16px] font-bold text-white transition-colors hover:bg-black"
              >
                변경
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
