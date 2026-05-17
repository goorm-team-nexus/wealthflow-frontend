import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:bg-muted">
      <div className="w-full max-w-[400px]">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 border-b border-border pb-6">
              <h1 className="text-2xl font-bold text-foreground">WealthFlow</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                모든 자산을 WealthFlow로 한번에 관리하세요
              </p>
            </div>

            <h2 className="mb-6 text-lg font-semibold text-foreground">회원가입</h2>

            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  이름
                </label>
                <Input type="text" id="name" />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  이메일
                </label>
                <Input type="email" id="email" placeholder="xxxx@gmail.com" />
                <div className="flex justify-end pt-1">
                  <Button type="button" size="sm">
                    인증요청
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  비밀번호
                </label>
                <Input type="password" id="password" placeholder="********" />
                <p className="text-xs text-destructive">
                  비밀번호는 영문, 숫자, 특수문자 조합으로 9자리를 입력하세요
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-medium text-foreground"
                >
                  비밀번호 재입력
                </label>
                <Input type="password" id="passwordConfirm" placeholder="********" />
                <p className="text-xs text-destructive">비밀번호가 다릅니다</p>
              </div>

              <div className="pt-4">
                <Button type="button" className="w-full">
                  회원가입
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
