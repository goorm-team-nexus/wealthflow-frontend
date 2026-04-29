# Frontend Code Convention

## Scope

- MUST 이 문서는 Next.js 16 App Router 기반 frontend 코드 구조와 책임 분리 기준에 적용한다.
- MUST 이 문서는 TypeScript, TailwindCSS, shadcn/ui 사용 코드를 전제로 한다.
- MUST 이 문서는 page, layout, loading, error, component, hook, state, API client, form 작성 기준에 적용한다.
- MUST 공통 협업 규칙, 브랜치, PR, 커밋 메시지 규칙은 `docs/conventions/frontend-development-guide.md`에서 관리한다.

## Out of Scope

- MUST 이 문서는 코드 스타일 상세 규칙을 포함하지 않는다.
- MUST 이 문서는 들여쓰기, 줄바꿈, 세미콜론, 따옴표 규칙을 포함하지 않는다.
- MUST 이 문서는 import 정렬 상세, 함수 선언 방식, component 선언 방식, props type 작성 스타일, className 정렬 방식을 포함하지 않는다.
- MUST 이 문서는 backend, DB, Spring 관련 구현 규칙을 포함하지 않는다.
- MUST 이 문서는 배포 절차를 포함하지 않는다.

## 1. 문서 목적

- MUST 이 문서는 frontend 코드의 구조, 책임, 경계 기준을 정의한다.
- MUST 이 문서는 AI agent가 frontend 작업 전 확인해야 하는 기준 문서로 사용한다.
- MUST 코드 스타일 상세 규칙은 별도 코드 스타일 문서에서 관리한다.

## 2. 기준 문서

- MUST agent 작업 기준은 `AGENTS.md`를 따른다.
- MUST 기능 범위 판단은 `docs/project/mvp-scope.md`를 따른다.
- MUST API 소비 규칙은 `docs/api/api-contract.md`와 OpenAPI contract를 따른다.
- MUST 도메인 규칙은 `docs/domain/README.md`를 따른다.
- MUST 보안 관련 규칙은 `docs/security/security-guidelines.md`를 따른다.
- MUST 새 문서를 추가하거나 문서 위치를 변경할 때 `docs/README.md`를 함께 갱신한다.

## 3. 구조 원칙

- MUST App Router의 route segment를 기준으로 화면 단위를 배치한다.
- MUST route segment 내부 코드는 해당 route의 화면 책임에 한정한다.
- MUST route 전용 코드는 해당 route segment 내부에 둔다.
- MUST 공용 코드는 재사용 의도가 있는 책임 단위로 분리한다.
- MUST 공용 코드의 이름과 위치는 재사용 대상과 책임을 드러내야 한다.
- MUST 임시 확장만을 이유로 공용 추상화를 만들지 않는다.
- MUST 모의투자와 실자산 도메인의 balance, state, business logic을 분리한다.
- MUST frontend repo에서 backend 책임을 구현하지 않는다.

## 4. 책임 분리

- MUST page 파일은 route 진입점 역할을 담당한다.
- MUST page 파일은 데이터 준비, 레이아웃 조합, 주요 view 연결을 담당한다.
- MUST 복잡한 조건 분기, 반복 UI, interaction 로직은 별도 component 또는 hook으로 분리한다.
- MUST Server Component를 기본 선택지로 사용한다.
- MUST 사용자 이벤트가 필요한 UI는 Client Component로 작성한다.
- MUST 브라우저 상태 또는 browser API가 필요한 UI는 Client Component로 작성한다.
- MUST 실시간 데이터 구독, timer, websocket, interaction 기반 refresh가 필요한 UI는 Client Component로 작성한다.
- MUST interaction 기반 open, close, select, drag, input 상태가 필요한 UI는 Client Component로 작성한다.
- MUST Client Component는 필요한 파일에만 `"use client"`를 선언한다.
- MUST `"use client"`를 route tree 상단에 불필요하게 전파하지 않는다.
- MUST domain 계산 로직이 JSX와 결합될 경우 component 밖으로 분리한다.
- MUST format, mapping, validation, API request 로직이 UI 표시 코드와 결합될 경우 분리한다.

## 5. 파일/폴더 네이밍 원칙

- MUST route segment 폴더명은 URL 구조를 기준으로 정한다.
- MUST route segment 폴더명은 소문자 기반으로 작성한다.
- MUST 동적 route segment는 App Router의 bracket 규칙을 따른다.
- MUST 파일명은 역할을 드러내는 이름을 사용한다.
- MUST component 파일명은 component 책임을 드러내는 이름을 사용한다.
- MUST hook 파일명은 `use` prefix를 사용한다.
- MUST route 전용 파일은 해당 route segment 내부에 둔다.
- MUST 공용 파일은 사용 범위가 드러나는 공용 폴더에 둔다.
- MUST 의미 없는 이름을 사용하지 않는다.
- MUST backend 용어를 frontend 파일 구조의 기준으로 사용하지 않는다.

## 6. 컴포넌트 분리 기준

- MUST component는 하나의 UI 책임을 기준으로 작성한다.
- MUST component가 데이터 조회, 상태 관리, 표시 로직을 모두 포함해 복잡해질 경우 책임을 분리한다.
- MUST component 내부 조건 분기가 주요 화면 상태를 여러 개 표현할 경우 하위 component로 분리한다.
- MUST 반복되는 UI 패턴이 동일한 책임으로 재사용될 경우 공용 component로 분리한다.
- MUST 단일 route에 종속된 component는 route 내부에 둔다.
- MUST 재사용 의도가 있는 component는 공용 component 영역에 둔다.
- MUST shadcn/ui primitive wrapper는 재사용할 의미가 있는 UI 책임을 가질 때 만든다.
- MUST component props는 component 책임에 필요한 값만 받는다.
- MUST component가 전역 상태 구조와 강하게 결합될 경우 selector, hook, adapter로 분리한다.
- MUST component가 API response raw shape에 직접 의존하지 않는다.

## 7. 페이지/라우트 작성 기준

- MUST `page.tsx`는 해당 route의 화면 진입점으로 작성한다.
- MUST `layout.tsx`는 route segment 공통 layout 책임만 가진다.
- MUST `loading.tsx`는 route segment navigation과 initial loading UI를 담당한다.
- MUST `error.tsx`는 route segment runtime error UI를 담당한다.
- MUST `not-found.tsx`는 route segment not found UI를 담당한다.
- MUST URL params와 search params는 route 경계에서 해석한다.
- MUST route 경계에서 해석한 값은 하위 component에 명시적으로 전달한다.
- MUST route 구조로 표현할 수 있는 화면 상태를 전역 상태로만 관리하지 않는다.
- MUST route handler는 frontend repo 책임 범위에서만 작성한다.
- MUST App Router 규칙과 충돌하는 custom routing 패턴을 만들지 않는다.

## 8. Suspense / Streaming 기준

- MUST 독립적으로 지연 가능한 UI는 Suspense boundary로 분리한다.
- MUST `loading.tsx`는 route segment 단위 fallback에 사용한다.
- MUST Suspense fallback은 component 단위 async UI에 사용한다.
- MUST `loading.tsx`를 component 내부 pending UI 대체 수단으로 사용하지 않는다.
- MUST Suspense fallback UI는 최종 UI와 유사한 공간을 차지해야 한다.
- MUST streaming으로 먼저 보여줄 수 있는 UI와 늦게 도착하는 UI의 책임을 분리한다.

## 9. Server Action 사용 기준

- MUST Server Action을 사용하는 경우 form submit 또는 mutation entry point에 한정한다.
- MUST Server Action은 단일 mutation 책임을 가진다.
- MUST Server Action을 사용하는 경우 request validation과 API contract 기준을 따른다.
- MUST Server Action을 browser interaction state 관리에 사용하지 않는다.
- MUST Server Action 결과는 UI에서 사용할 수 있는 success 또는 error model로 변환한다.
- MUST Server Action 내부에 secret, credential, token을 하드코딩하지 않는다.
- MUST Server Action으로 backend 책임의 business rule을 재구현하지 않는다.

## 10. 상태 관리 기준

- MUST 상태는 가장 좁은 소유 범위에 둔다.
- MUST 단일 component에서만 사용하는 상태는 local state로 둔다.
- MUST route 내부에서 공유하는 상태는 route 내부 owner component에 둔다.
- MUST route 간 공유가 필요한 상태만 전역 상태로 둔다.
- MUST server state는 API client 또는 데이터 fetching 계층에서 관리한다.
- MUST 서버 데이터 cache 상태와 client UI 상태를 분리한다.
- MUST form 입력 상태와 서버 저장 상태를 분리한다.
- MUST URL로 표현해야 하는 filter, tab, pagination 상태는 search params로 관리한다.
- MUST search params를 사용하는 경우 URL과 UI state 간 동기화를 유지한다.
- MUST 인증, 계정, 포트폴리오, 주문, 잔고 상태를 임의로 복제하지 않는다.
- MUST 모의투자 상태와 실자산 상태를 같은 store 또는 같은 state 객체에 섞지 않는다.
- MUST derived state는 원본 state에서 계산한다.
- MUST 동일한 의미의 state가 여러 위치에 저장될 경우 단일 owner를 정한다.

## 11. API 호출 기준

- MUST API 호출은 OpenAPI contract를 기준으로 작성한다.
- MUST API endpoint, request, response shape은 `docs/api/api-contract.md`를 확인한 뒤 사용한다.
- MUST UI component 내부에 fetch 세부 구현을 직접 작성하지 않는다.
- MUST API 호출 코드는 공용 API client 또는 service 계층에 둔다.
- MUST API response에서 UI model로 변환하는 로직은 service 또는 mapper 계층에 둔다.
- MUST component와 page에서 raw response를 직접 가공하지 않는다.
- MUST API error는 UI에서 표시 가능한 error model로 변환한다.
- MUST backend contract에 없는 field를 사용할 경우 fallback 값을 명시한다.
- MUST fallback 값은 UI 표시 목적에 한정한다.
- MUST fallback 값으로 domain state 또는 business result를 확정하지 않는다.
- MUST backend 책임의 business rule을 frontend에서 재구현하지 않는다.
- MUST mock data는 명시된 mock 영역에서만 사용한다.
- MUST 실제 API와 mock data 전환 기준을 코드에서 확인 가능하게 작성한다.
- MUST 인증 token, secret, credential을 코드에 하드코딩하지 않는다.

## 12. 폼/검증 기준

- MUST form state는 해당 form owner component가 소유한다.
- MUST form submit 로직은 UI 표시 로직과 분리한다.
- MUST validation rule은 화면 표시 코드와 분리한다.
- MUST client validation은 사용자 입력 피드백 책임을 가진다.
- MUST backend validation을 client validation으로 대체하지 않는다.
- MUST form field error는 field와 가까운 위치에 표시한다.
- MUST submit pending 상태를 UI에 반영한다.
- MUST submit 중 중복 제출을 막는다.
- MUST API error와 validation error를 구분한다.
- MUST 금액, 수량, 통화, 종목 식별자 입력은 도메인 규칙을 따른다.

## 13. 에러/로딩 UI 기준

- MUST route 단위 pending UI는 `loading.tsx`에서 처리한다.
- MUST component 단위 pending UI는 Suspense fallback 또는 component 내부 loading state로 처리한다.
- MUST route 단위 runtime error UI는 `error.tsx`에서 처리한다.
- MUST not found 상태는 `not-found.tsx` 또는 명시적 not found UI로 처리한다.
- MUST loading UI는 layout shift를 줄이는 형태로 작성한다.
- MUST error UI는 사용자에게 필요한 복구 action을 제공한다.
- MUST error message에 secret, token, 내부 endpoint, stack trace를 노출하지 않는다.
- MUST empty state와 error state를 구분한다.
- MUST 네트워크 실패, 권한 실패, 데이터 없음 상태를 구분 가능한 UI state로 처리한다.

## 14. shadcn/ui 사용 기준

- MUST 기본 UI primitive는 shadcn/ui를 기준으로 사용한다.
- MUST button, dialog, dropdown, form control, table, tabs, toast 계열 UI는 shadcn/ui component를 우선 기준으로 삼는다.
- MUST shadcn/ui component를 수정할 경우 기존 사용처 영향을 확인한다.
- MUST shadcn/ui primitive의 구조 변경이 필요할 경우 wrapper component에서 처리한다.
- MUST 화면 전용 variant는 해당 화면의 wrapper component에서 처리한다.
- MUST 접근성 속성은 shadcn/ui 기본 패턴과 충돌하지 않아야 한다.
- MUST 동일한 역할의 custom primitive를 만들 경우 shadcn/ui로 해결할 수 없는 책임을 가져야 한다.

## 15. TailwindCSS 사용 기준

- MUST TailwindCSS는 layout, spacing, sizing, color 보조 스타일에 사용한다.
- MUST shadcn/ui primitive를 기반으로 한 구조 조정은 wrapper component에서 처리한다.
- MUST Tailwind class는 component 책임 범위 안에서 사용한다.
- MUST 동일한 스타일 조합이 재사용 책임을 가질 경우 component로 분리한다.
- MUST domain 상태를 Tailwind class 문자열에 직접 결합하지 않는다.
- MUST theme token 또는 기존 design token을 우선 사용한다.
- MUST 임의 색상값, 임의 spacing 값, 임의 z-index 값은 기존 token으로 표현할 수 없을 때만 사용한다.
- MUST responsive UI는 route와 component 책임에 맞게 정의한다.
- MUST TailwindCSS를 business logic 표현 수단으로 사용하지 않는다.

## 16. 금지 패턴

- MUST NOT backend, DB, Spring 책임 코드를 frontend repo에 구현한다.
- MUST NOT OpenAPI contract와 충돌하는 API shape을 만든다.
- MUST NOT secret, credential, token을 하드코딩한다.
- MUST NOT 실자산과 모의투자 상태를 같은 state model에 섞는다.
- MUST NOT page 파일에 복잡한 business logic을 결합한다.
- MUST NOT UI component 내부에 API request 세부 구현을 작성한다.
- MUST NOT Client Component를 route tree 상단에 불필요하게 선언한다.
- MUST NOT 전역 상태를 local state 대체 수단으로 사용한다.
- MUST NOT URL로 표현해야 하는 상태를 전역 상태에만 저장한다.
- MUST NOT loading, error, empty state를 하나의 상태로 합친다.
- MUST NOT shadcn/ui와 같은 역할의 custom primitive를 중복 작성한다.
- MUST NOT 단일 사용처 코드를 미래 가능성만으로 공용 폴더로 이동한다.
- MUST NOT 미래 확장만을 이유로 미사용 abstraction을 만든다.
- MUST NOT 코드 스타일 상세 규칙을 이 문서에 포함한다.
