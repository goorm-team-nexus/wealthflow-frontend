# Frontend Directory Structure

## Scope

- MUST 이 문서는 frontend 디렉토리 구조 기준을 정의한다.
- MUST 이 문서는 App Router route segment, route 전용 코드, 공용 코드 배치 기준에 적용한다.

## Out of Scope

- MUST NOT 이 문서는 코드 스타일을 정의한다.
- MUST NOT 이 문서는 business logic을 정의한다.
- MUST NOT 이 문서는 API contract를 정의한다.
- MUST NOT 이 문서는 PR, review, verification 규칙을 정의한다.

## 디렉토리 구조 원칙

- MUST App Router 기준으로 route segment를 구성한다.
- MUST route segment 내부는 해당 화면 책임만 가진다.
- MUST 공용 component는 shared 영역에 둔다.
- MUST route 전용 코드는 route 내부에 둔다.
- MUST 공용 코드는 재사용 의도가 있는 경우에만 분리한다.

## 예시 구조

```txt
app/
  (route)/
    page.tsx
    layout.tsx
    loading.tsx
    error.tsx
    components/

components/
  ui/
  shared/

hooks/
services/
lib/
types/
```

## 디렉토리 역할

### `app/`

- MUST App Router route segment를 둔다.
- MUST `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`는 App Router 규칙에 따라 배치한다.
- MUST route 전용 component는 해당 route segment 내부 `components/`에 둔다.

### `components/ui/`

- MUST shadcn/ui 기반 primitive component를 둔다.
- MUST 특정 화면 전용 business logic을 포함하지 않는다.

### `components/shared/`

- MUST 두 개 이상의 route 또는 feature에서 재사용하는 UI component를 둔다.
- MUST 단일 route 전용 component를 두지 않는다.

### `hooks/`

- MUST 여러 route 또는 component에서 재사용하는 custom hook을 둔다.
- MUST route 전용 hook은 해당 route 내부에 둔다.

### `services/`

- MUST API client, API service, 외부 데이터 요청 책임을 둔다.
- MUST UI component에서 직접 API request를 작성하지 않는다.

### `lib/`

- MUST 공통 utility, helper, config성 코드를 둔다.
- MUST domain business logic을 무분별하게 넣지 않는다.

### `types/`

- MUST 여러 영역에서 공유하는 TypeScript type을 둔다.
- MUST API response type과 UI model type을 구분한다.
