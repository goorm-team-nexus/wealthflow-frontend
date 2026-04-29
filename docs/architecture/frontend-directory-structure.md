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
