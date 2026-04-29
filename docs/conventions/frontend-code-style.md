# Frontend Code Style

## Scope

- MUST 이 문서는 frontend 코드 작성 스타일 기준에 적용한다.
- MUST 이 문서는 Next.js 16 App Router, TypeScript, TailwindCSS, shadcn/ui 사용 코드를 전제로 한다.
- MUST 구조, 책임, 경계 기준은 `docs/conventions/frontend-code-convention.md`를 따른다.
- MUST formatter/linter로 강제할 항목과 문서로 명시할 항목을 구분한다.

## Out of Scope

- MUST 이 문서는 frontend 구조, 책임, 경계 기준을 정의하지 않는다.
- MUST 이 문서는 frontend 외 영역의 구현 규칙을 포함하지 않는다.
- MUST 이 문서는 브랜치, PR, 커밋 메시지 규칙을 포함하지 않는다.
- MUST 이 문서는 배포 절차를 포함하지 않는다.

## 1. 파일명/폴더명 스타일

- MUST route segment 폴더명은 App Router URL 구조와 일치시킨다.
- MUST route segment 폴더명은 lowercase kebab-case를 사용한다.
- MUST dynamic route segment는 `[id]`, `[slug]` 형태를 사용한다.
- MUST route group은 `(group-name)` 형태를 사용한다.
- MUST component 파일명은 PascalCase를 사용한다.
- MUST custom hook 파일명은 `use` prefix와 camelCase를 사용한다.
- MUST util, mapper, service 파일명은 camelCase 또는 kebab-case 중 기존 디렉터리 패턴을 따른다.
- MUST test, story, mock 파일은 대상 파일명을 기준으로 suffix를 붙인다.
- MUST 의미 없는 `index.tsx` 재노출 패턴을 새로 추가하지 않는다.

## 2. TypeScript 타입 작성 스타일

- MUST public API의 입력과 출력 타입을 명시한다.
- MUST object shape은 `type`으로 작성한다.
- MUST 외부 확장이 필요한 계약 타입은 `interface`로 작성한다.
- MUST union type은 가능한 literal union으로 작성한다.
- MUST API response 타입과 UI model 타입을 분리한다.
- MUST `any`를 사용하지 않는다.
- MUST `unknown`은 runtime narrowing과 함께 사용한다.
- MUST nullable 값은 `null` 또는 `undefined` 중 기존 타입 계약을 따른다.
- MUST enum 대신 literal union 또는 `as const` object를 사용한다.

## 3. React Component 선언 스타일

- MUST component는 named function declaration으로 선언한다.
- MUST default export가 필요한 App Router 파일은 framework 규칙을 따른다.
- MUST component 이름은 PascalCase를 사용한다.
- MUST component 파일은 주 component 하나를 중심으로 작성한다.
- MUST 파일 내부 보조 component는 같은 파일의 주 component에 종속될 때만 둔다.
- MUST Client Component는 파일 최상단에 `"use client"`를 선언한다.
- MUST component 반환 타입은 TypeScript 추론을 사용한다.
- MUST `React.FC`를 사용하지 않는다.

## 4. Props Type 작성 스타일

- MUST props type 이름은 `{ComponentName}Props` 형식을 사용한다.
- MUST props type은 component 선언보다 위에 둔다.
- MUST props type은 component가 사용하는 값만 포함한다.
- MUST optional prop은 실제 optional 동작이 있을 때만 사용한다.
- MUST boolean prop은 긍정형 이름을 사용한다.
- MUST callback prop은 `on` prefix를 사용한다.
- MUST render prop은 반환 UI 책임을 이름에 드러낸다.
- MUST API response type을 props type으로 직접 사용하지 않는다.

## 5. Function 선언 스타일

- MUST module-level function은 function declaration으로 작성한다.
- MUST component 내부 event handler는 `const` function expression으로 작성한다.
- MUST async function은 이름에 수행 책임을 드러낸다.
- MUST boolean을 반환하는 function은 `is`, `has`, `can`, `should` prefix를 사용한다.
- MUST formatter function은 `format` prefix를 사용한다.
- MUST mapper function은 `map` 또는 `to` prefix를 사용한다.
- MUST side effect가 있는 function은 이름에 action을 드러낸다.
- MUST 의미 없는 `handleSubmit2`, `processData`, `doSomething` 이름을 사용하지 않는다.

## 6. Custom Hook 작성 스타일

- MUST custom hook 이름은 `use` prefix를 사용한다.
- MUST custom hook은 React hook 규칙을 따른다.
- MUST custom hook은 하나의 상태 또는 interaction 책임을 가진다.
- MUST custom hook 반환값은 object 형태로 작성한다.
- MUST custom hook 반환값 이름은 caller가 그대로 사용할 수 있게 작성한다.
- MUST custom hook 내부에서 API raw response를 UI component에 노출하지 않는다.
- MUST custom hook 내부 side effect는 dependency를 명시한다.
- MUST hook이 route에 종속될 경우 route 내부에 둔다.

## 7. Import 작성/정렬 스타일

- MUST import는 파일 최상단에 작성한다.
- MUST side effect import는 다른 import보다 먼저 작성한다.
- MUST 외부 패키지 import와 내부 경로 import를 그룹으로 분리한다.
- MUST alias import는 상대 경로 import보다 위에 둔다.
- MUST 같은 module에서 가져오는 import는 하나로 합친다.
- MUST type-only import는 `import type`을 사용한다.
- MUST 사용하지 않는 import를 남기지 않는다.
- MUST 순환 참조를 만드는 import를 작성하지 않는다.
- MUST import 정렬의 세부 순서는 formatter/linter 설정을 따른다.

## 8. Tailwind className 작성 스타일

- MUST `className`은 UI 구조를 읽을 수 있는 수준으로 작성한다.
- MUST 조건부 class는 `cn` helper를 사용한다.
- MUST 반복되는 class 조합은 component 또는 variant로 분리한다.
- MUST variant가 필요한 UI는 명시적인 variant 값으로 표현한다.
- MUST domain state를 class 문자열 안에서 직접 계산하지 않는다.
- MUST 임의 값 class는 design token으로 표현할 수 없을 때만 사용한다.
- MUST responsive class는 작은 viewport 기준에서 큰 viewport 순서로 작성한다.
- MUST className 정렬은 formatter/linter 설정을 따른다.

## 9. shadcn/ui Wrapper 작성 스타일

- MUST shadcn/ui primitive wrapper는 PascalCase component로 작성한다.
- MUST wrapper props는 shadcn/ui primitive props를 필요한 범위에서 확장한다.
- MUST wrapper는 화면 전용 copy와 domain logic을 포함하지 않는다.
- MUST wrapper variant는 명시적인 prop으로 표현한다.
- MUST wrapper 내부 className 병합은 `cn` helper를 사용한다.
- MUST wrapper는 접근성 속성을 제거하지 않는다.
- MUST wrapper가 ref forwarding을 필요로 할 경우 shadcn/ui primitive 패턴을 따른다.

## 10. 조건부 렌더링 스타일

- MUST loading, error, empty, success 상태를 구분해서 렌더링한다.
- MUST early return은 화면 전체 상태 분기에 사용한다.
- MUST inline conditional은 짧은 UI fragment에만 사용한다.
- MUST 중첩 ternary를 사용하지 않는다.
- MUST 복잡한 조건은 이름 있는 boolean 변수로 분리한다.
- MUST 조건식에 domain 계산 로직을 직접 작성하지 않는다.
- MUST fallback UI는 상태 의미가 드러나는 component 또는 fragment로 작성한다.

## 11. 이벤트 핸들러 네이밍 스타일

- MUST event handler 이름은 `handle` prefix를 사용한다.
- MUST props callback 이름은 `on` prefix를 사용한다.
- MUST DOM event handler는 event 이름을 포함한다.
- MUST submit handler는 `handleSubmit` 또는 action이 드러나는 이름을 사용한다.
- MUST change handler는 대상 field 이름을 포함한다.
- MUST click handler는 수행 action을 포함한다.
- MUST handler 이름에 UI 구현 세부사항만 담지 않는다.

## 12. Formatter/Linter 담당 항목

- MUST 들여쓰기는 formatter 설정을 따른다.
- MUST 줄바꿈은 formatter 설정을 따른다.
- MUST 세미콜론은 formatter 설정을 따른다.
- MUST 따옴표는 formatter 설정을 따른다.
- MUST trailing comma는 formatter 설정을 따른다.
- MUST bracket spacing은 formatter 설정을 따른다.
- MUST import 정렬 세부 규칙은 linter 또는 formatter 설정을 따른다.
- MUST Tailwind class 정렬 세부 규칙은 formatter 또는 linter 설정을 따른다.
- MUST 미사용 변수와 미사용 import는 linter 설정을 따른다.

## 13. 문서로 명시할 항목

- MUST 파일명과 폴더명 의미는 이 문서를 따른다.
- MUST type, props, component, function, hook 이름은 이 문서를 따른다.
- MUST API response type과 UI model type 분리는 이 문서를 따른다.
- MUST condition rendering 방식은 이 문서를 따른다.
- MUST event handler naming은 이 문서를 따른다.
- MUST shadcn/ui wrapper 작성 방식은 이 문서를 따른다.
- MUST Tailwind className 책임 분리는 이 문서를 따른다.

## 14. 금지 패턴

- MUST NOT use `any`.
- MUST NOT `React.FC`를 사용한다.
- MUST NOT API response type을 component props로 직접 사용한다.
- MUST NOT component 또는 page에서 API raw response를 직접 가공한다.
- MUST NOT 중첩 ternary를 사용한다.
- MUST NOT unused import, unused variable을 남긴다.
- MUST NOT 의미 없는 파일명, 함수명, 변수명을 사용한다.
- MUST NOT className 문자열 안에 domain logic을 결합한다.
- MUST NOT shadcn/ui wrapper에 화면 전용 business logic을 넣는다.
- MUST NOT formatter/linter가 담당하는 항목을 코드 리뷰에서 수동 기준으로 판단한다.
