import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EditInfo() {
  return (
    <div className="w-full p-4">
      <Card>
        <CardContent className="flex flex-col gap-6 p-4">
          <h2 className="text-lg font-semibold">내 정보 수정</h2>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름
              </label>
              <Input type="text" id="name" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호 변경
              </label>
              <Input type="password" id="password" placeholder="********" />
              <p className="text-xs text-destructive">
                비밀번호는 영문, 숫자, 특수문자 조합으로 9자리를 입력하세요
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="passwordConfirm" className="text-sm font-medium">
                비밀번호 재입력
              </label>
              <Input type="password" id="passwordConfirm" placeholder="********" />
              <p className="text-xs text-destructive">비밀번호가 다릅니다</p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">이메일</span>
              <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                xxxx@gmail.com
              </div>
            </div>

            <Button type="button" className="w-full">
              변경
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
