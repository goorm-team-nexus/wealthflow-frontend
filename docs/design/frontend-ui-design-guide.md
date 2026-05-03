# Frontend UI Design Guide

## Scope

- MUST 이 문서는 Figma 기반 frontend UI 설계 기준에 적용한다.
- MUST 이 문서는 Next.js App Router, TypeScript, TailwindCSS, shadcn/ui 구현을 전제로 한다.
- MUST 이 문서는 Figma 화면 구조를 frontend 코드 구조로 매핑하기 위한 기준으로 사용한다.
- MUST UI/component 구현 규칙은 `docs/conventions/frontend-code-convention.md`와 `docs/conventions/frontend-code-style.md`를 함께 따른다.
- MUST 기능 범위 판단은 `docs/project/mvp-scope.md`를 따른다.

## Out of Scope

- MUST NOT 이 문서는 backend, API contract, DB, Spring 책임을 정의한다.
- MUST NOT 이 문서는 business logic, domain state, API request/response shape을 정의한다.
- MUST NOT 이 문서는 Figma에서 생성한 코드를 그대로 사용하는 절차를 정의한다.
- MUST NOT 이 문서는 신규 dependency 추가 기준을 정의한다.

## 1. 문서 목적

- MUST Figma는 Next.js 구현을 위한 UI 설계도로 사용한다.
- MUST Figma 구조는 실제 React component 구조와 직접 매핑 가능해야 한다.
- MUST Figma에서 만든 페이지, 섹션, form, component 계층은 코드의 route, layout, component, form 계층과 대응되어야 한다.
- MUST UI는 shadcn/ui component와 TailwindCSS token을 조립해서 설계한다.
- MUST Figma의 시각 표현만으로 코드 구조를 추론해야 하는 상태를 만들지 않는다.

## 2. 기준 문서

- MUST agent 작업 기준은 `AGENTS.md`를 따른다.
- MUST frontend 구조와 책임 분리는 `docs/conventions/frontend-code-convention.md`를 따른다.
- MUST frontend 코드 스타일은 `docs/conventions/frontend-code-style.md`를 따른다.
- MUST 디렉터리 구조 판단은 `docs/architecture/frontend-directory-structure.md`를 따른다.
- MUST 도메인 규칙 판단은 `docs/domain/README.md`를 따른다.
- MUST API 연동이 포함될 경우 `docs/api/README.md`와 OpenAPI contract를 따른다.
- MUST 새 design 문서를 추가하거나 이동할 경우 `docs/README.md`를 함께 갱신한다.

## 3. Figma 작업 단위

- MUST 페이지는 Figma Frame으로 작성한다.
- MUST 페이지 Frame 이름은 route 또는 page component 책임을 드러내야 한다.
- MUST 페이지 Frame은 mobile viewport 기준 `390px` width를 기본으로 한다.
- MUST 페이지 Frame height는 콘텐츠 길이에 맞게 자유롭게 설정한다.
- MUST 페이지 Frame에는 Auto Layout을 적용한다.
- MUST 페이지 Frame의 기본 Auto Layout direction은 vertical로 설정한다.
- MUST 페이지 Frame의 기본 gap은 `16px`로 설정한다.
- MUST 페이지 Frame의 기본 padding은 `16px`로 설정한다.
- MUST 페이지 내부 주요 영역은 Header, Section, Form, Footer 같은 의미 단위 Frame으로 분리한다.

## 4. Figma Auto Layout 기준

- MUST 화면 배치는 Auto Layout을 기준으로 설계한다.
- MUST 요소 간 간격은 gap으로 표현한다.
- MUST 영역 내부 여백은 padding으로 표현한다.
- MUST code mapping이 필요한 section, form, list, card content에는 Auto Layout을 적용한다.
- MUST vertical stack은 Tailwind의 `space-y-*` 또는 `gap-*`과 매핑 가능해야 한다.
- MUST horizontal row는 Tailwind의 `flex`, `items-*`, `justify-*`, `gap-*`과 매핑 가능해야 한다.
- MUST NOT 요소 위치 조정을 위해 임의 margin을 사용한다.
- MUST NOT absolute positioning으로 일반 layout 흐름을 대체한다.
- EXCEPTION: overlay, dialog, popover, toast, fixed navigation처럼 UI 역할상 위치 고정이 필요한 component는 shadcn/ui 또는 기존 component 패턴을 기준으로 absolute/fixed positioning을 사용할 수 있다.

## 5. shadcn/ui 사용 기준

- MUST Button, Input, Card, Dialog, Select, Tabs 같은 기본 UI primitive는 shadcn/ui component를 기준으로 설계한다.
- MUST Figma에서는 shadcn/ui에 대응되는 Assets component instance를 사용한다.
- MUST component instance는 코드의 `@/components/ui/*` import와 매핑 가능해야 한다.
- MUST shadcn/ui component의 기본 구조와 accessibility 패턴을 유지한다.
- MUST variant가 필요한 경우 shadcn/ui가 제공하는 variant 또는 프로젝트에 이미 정의된 wrapper variant를 기준으로 한다.
- MUST NOT Button, Input, Card, Dialog, Select, Tabs 역할의 custom primitive를 도형으로 직접 만든다.
- MUST NOT shadcn/ui instance를 detach해서 임의 구조로 변경한다.
- MUST NOT component 기본 spacing, height, border radius, color를 임의로 수정한다.
- EXCEPTION: 카카오 로그인 버튼, 외부 플랫폼 정책을 따라야 하는 소셜 로그인 버튼, 결제/인증 provider가 제공하는 브랜드 버튼은 provider guide에 맞춰 별도 component로 설계할 수 있다.
- EXCEPTION: shadcn/ui에 없는 도메인 전용 visualization, chart, ticker, portfolio summary 같은 UI는 기존 project pattern 또는 별도 승인된 component 기준으로 설계할 수 있다.

## 6. Figma 레이어 구조 기준

- MUST Figma layer tree는 실제 JSX 계층과 같은 의미 순서로 구성한다.
- MUST page Frame 아래에는 화면 책임 단위의 section 또는 component group을 둔다.
- MUST form field와 submit button은 Form Frame 내부에 둔다.
- MUST Form Frame에는 Auto Layout을 적용한다.
- MUST Card 내부 콘텐츠는 Card content 영역과 매핑 가능한 Frame으로 묶는다.
- MUST list UI는 list container와 item component를 구분한다.
- MUST 같은 역할의 반복 item은 동일한 component instance 또는 동일한 layer 구조를 사용한다.
- MUST UI state가 다른 경우 default, loading, error, empty, disabled 같은 상태 이름을 layer 또는 variant에서 구분한다.
- MUST NOT 시각적 정렬만 맞고 layer tree가 코드 구조와 무관한 구조를 만든다.

### Required Structure Example

```text
LoginPage (Frame / Auto Layout)
└─ Card
   └─ Form (Frame / Auto Layout)
      ├─ Input_email
      ├─ Input_password
      └─ Button_login
```

## 7. 레이어 네이밍 기준

- MUST page Frame 이름은 PascalCase page 이름을 사용한다.
- MUST page Frame 이름은 코드의 page component 또는 route 책임과 매핑 가능해야 한다.
- MUST 영역 이름은 Header, Form, Section, Footer, List, Item 같은 구조적 책임을 사용한다.
- MUST component layer 이름은 component 역할과 대상 데이터를 함께 드러낸다.
- MUST form field 이름은 입력 대상 field를 포함한다.
- MUST action button 이름은 수행 action을 포함한다.
- MUST 반복 item 이름은 item 책임을 포함한다.
- MUST 의미 없는 `Frame 1`, `Group 2`, `Rectangle`, `Button copy` 이름을 남기지 않는다.

### Naming Examples

```text
LoginPage
Header
Form
PortfolioSection
Input_email
Input_password
Button_login
StockList
StockListItem
```

## 8. Figma to Next.js 매핑 기준

- MUST Figma Frame은 코드에서 `div`, `section`, `main`, `form` 중 semantic role에 맞는 element로 매핑한다.
- MUST Figma Card는 shadcn/ui `<Card>`와 매핑한다.
- MUST Figma Card 내부 콘텐츠는 `<CardContent>`와 매핑한다.
- MUST Figma Form은 `<form>`과 매핑한다.
- MUST Figma Input은 shadcn/ui `<Input>`과 매핑한다.
- MUST Figma Button은 shadcn/ui `<Button>`과 매핑한다.
- MUST Figma gap `16px`은 Tailwind `gap-4` 또는 vertical stack의 `space-y-4`와 매핑한다.
- MUST Figma padding `16px`은 Tailwind `p-4`와 매핑한다.
- MUST Figma structure가 component 분리를 요구하는 경우 코드에서도 같은 책임 단위로 component를 분리한다.

### Mapping Example

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="min-h-screen p-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <form className="space-y-4">
            <Input type="email" />
            <Input type="password" />
            <Button className="w-full">로그인</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
```

## 9. Spacing 기준

- MUST spacing은 Tailwind spacing scale과 직접 매핑 가능한 값만 사용한다.
- MUST 기본 spacing 값은 `8px`, `12px`, `16px`, `24px`, `32px` 중 하나를 사용한다.
- MUST Figma gap과 padding은 아래 mapping을 따른다.
- MUST 같은 stack 내부의 반복 간격은 동일한 spacing 값을 사용한다.
- MUST section 간 hierarchy가 필요한 경우 `24px` 또는 `32px`를 사용한다.
- MUST form field 간 기본 간격은 `16px`를 사용한다.
- MUST compact inline control 간 간격은 `8px` 또는 `12px`를 사용한다.
- MUST NOT 임의 spacing 값 또는 arbitrary Tailwind spacing class를 사용한다.
- MUST NOT margin으로 sibling 간격을 표현한다.
- EXCEPTION: shadcn/ui component 내부 기본 spacing은 component 기본값을 따른다.
- EXCEPTION: 1px border, divider, focus ring, chart axis, pixel alignment처럼 spacing token이 아닌 시각적 선 또는 좌표 표현에는 이 spacing scale을 적용하지 않는다.

### Spacing Mapping

| px  | Tailwind gap | Tailwind padding |
| --- | ------------ | ---------------- |
| 8   | `gap-2`      | `p-2`            |
| 12  | `gap-3`      | `p-3`            |
| 16  | `gap-4`      | `p-4`            |
| 24  | `gap-6`      | `p-6`            |
| 32  | `gap-8`      | `p-8`            |

## 10. Button 기준

- MUST button은 shadcn/ui `<Button>`을 기준으로 설계한다.
- MUST button size는 shadcn/ui size variant를 사용한다.
- MUST primary action button은 화면 또는 form의 주요 submit action에만 사용한다.
- MUST full width button이 필요한 경우 layout 책임으로 `w-full`을 적용한다.
- MUST disabled, loading, pending 상태를 구분 가능하게 설계한다.
- MUST NOT button height를 직접 수정한다.
- MUST NOT button padding을 임의 수정한다.
- MUST NOT text만 있는 임의 Frame 또는 Rectangle을 button으로 사용한다.
- EXCEPTION: provider 정책을 따라야 하는 소셜 로그인 버튼은 provider guide를 우선한다.

## 11. Color 기준

- MUST color는 shadcn/ui theme token 또는 프로젝트에 이미 정의된 design token을 사용한다.
- MUST 기본 color token은 `primary`, `secondary`, `muted`, `background`, `border`, `destructive`를 사용한다.
- MUST 보조 텍스트는 `text-muted-foreground`를 사용한다.
- MUST destructive action 또는 error state는 `destructive` 계열 token을 사용한다.
- MUST surface, border, foreground/background 관계는 shadcn/ui token 의미를 따른다.
- MUST NOT HEX, RGB, HSL literal 값을 Figma 또는 코드에 직접 사용한다.
- MUST NOT 임의 브랜드 색상을 product UI color token처럼 사용한다.
- EXCEPTION: 외부 provider brand asset, 소셜 로그인 버튼, 로고, 차트 팔레트처럼 token 외 색상이 식별 역할을 갖는 경우에는 제한적으로 사용할 수 있다.
- EXCEPTION: token 외 색상이 필요한 경우 기존 token으로 표현할 수 없는 이유와 사용 위치가 코드에서 확인 가능해야 한다.

## 12. Typography 기준

- MUST text style은 Tailwind typography class와 직접 매핑 가능해야 한다.
- MUST 아래 정의된 typography role만 사용한다.
- MUST 임의 font-size, font-weight, line-height를 사용하지 않는다.
- MUST page title은 Title role을 사용한다.
- MUST section title은 Subtitle role을 사용한다.
- MUST 기본 설명 또는 본문은 Body role을 사용한다.
- MUST 보조 설명은 Secondary role을 사용한다.
- MUST label, hint, metadata, caption은 Caption role을 사용한다.
- MUST NOT 같은 의미의 텍스트에 여러 typography role을 혼용한다.
- EXCEPTION: shadcn/ui component가 내부에서 제공하는 text size는 component 기본값을 따른다.
- EXCEPTION: chart label, table dense cell, legal copy처럼 정보 밀도나 접근성 때문에 별도 text size가 필요한 경우 기존 코드 패턴을 우선 확인하고 동일한 책임 범위에서만 사용한다.

### Typography Mapping

| Role      | Usage                | Tailwind class                  |
| --------- | -------------------- | ------------------------------- |
| Title     | 페이지 제목          | `text-2xl font-bold`            |
| Subtitle  | 섹션 제목            | `text-lg font-semibold`         |
| Body      | 본문                 | `text-base`                     |
| Secondary | 보조 텍스트          | `text-sm text-muted-foreground` |
| Caption   | 설명, 라벨, metadata | `text-xs text-muted-foreground` |

### Typography Example

```tsx
<h1 className="text-2xl font-bold">로그인</h1>
<h2 className="text-lg font-semibold">계정 정보</h2>
<p className="text-base">이메일을 입력해주세요</p>
<span className="text-sm text-muted-foreground">비밀번호는 8자 이상</span>
<span className="text-xs text-muted-foreground">* 필수 입력 항목</span>
```

## Font 기준

- MUST font fallback은 Geist → Noto Sans KR → system font 순서로 구성한다.
- MUST Latin glyph는 Geist를 기준으로 렌더링된다.
- MUST Korean glyph는 Geist에 글리프가 없을 경우 Noto Sans KR로 fallback된다.
- MUST font-family는 CSS variable 기반으로 관리한다.
- MUST font fallback 순서는 코드와 동일해야 한다.

## 13. 금지 패턴

- MUST NOT Figma를 코드 자동 생성 결과물로 간주한다.
- MUST NOT Figma layer tree와 JSX 구조가 다르게 설계된 화면을 확정한다.
- MUST NOT Auto Layout 없이 page, form, section, list 구조를 만든다.
- MUST NOT shadcn/ui로 표현 가능한 primitive를 직접 만든다.
- MUST NOT shadcn/ui instance를 detach해서 임의 component로 변경한다.
- MUST NOT 도형만으로 Button, Input, Card, Select, Tabs, Dialog를 만든다.
- MUST NOT sibling spacing을 margin으로 표현한다.
- MUST NOT spacing scale 밖의 값을 임의로 사용한다.
- MUST NOT button height 또는 padding을 직접 수정한다.
- MUST NOT HEX, RGB, HSL literal color를 직접 사용한다.
- MUST NOT typography role 밖의 임의 font-size를 사용한다.
- MUST NOT 의미 없는 layer name을 남긴다.
- MUST NOT UI design 단계에서 실자산과 모의투자 balance, state, business logic을 섞는다.
