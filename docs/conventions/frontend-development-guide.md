# Frontend Development Guide

## Scope

- MUST 이 문서는 frontend 협업 및 개발 운영 규칙에 적용한다.
- MUST 이 문서는 branch, commit, pull request, review, environment, API base URL, local verification, document reference 규칙에 적용한다.
- MUST frontend 코드 구조와 책임 기준은 `docs/conventions/frontend-code-convention.md`를 따른다.
- MUST frontend 코드 작성 스타일 기준은 `docs/conventions/frontend-code-style.md`를 따른다.

## Out of Scope

- MUST NOT 이 문서는 frontend 코드 구조, 책임, 경계 기준을 정의한다.
- MUST NOT 이 문서는 frontend 코드 작성 스타일 기준을 정의한다.
- MUST NOT 이 문서는 backend repo 책임을 정의한다.
- MUST NOT 이 문서는 배포 절차를 정의한다.
- MUST NOT 이 문서는 실행 명령어를 포함한다.
- MUST NOT 이 문서는 env 변수 목록을 포함한다.

## 1. 문서 목적

- MUST 이 문서는 frontend repo의 협업 및 개발 흐름 기준으로 사용한다.
- MUST 이 문서는 AI agent와 개발자가 작업 전 확인해야 하는 운영 기준으로 사용한다.
- MUST 이 문서는 `frontend-code-convention.md`와 `frontend-code-style.md`의 책임 범위를 침범하지 않는다.

## 2. 브랜치 전략

- MUST `main` branch는 배포 가능한 안정 상태를 유지한다.
- MUST `develop` branch는 통합 개발 기준 branch로 사용한다.
- MUST 기능 작업은 `develop`에서 분기한 feature branch에서 수행한다.
- MUST feature branch는 단일 기능, 단일 수정, 단일 문서 작업 범위를 가진다.
- MUST feature branch 이름은 작업 목적을 식별할 수 있어야 한다.
- MUST feature branch는 PR을 통해 `develop`에 병합한다.
- MUST `main` 병합은 검증된 `develop` 상태를 기준으로 수행한다.
- MUST 긴급 수정은 `main`에서 분기한 hotfix branch에서 수행한다.
- MUST hotfix branch는 검증 후 `main`과 `develop`에 반영한다.
- MUST NOT `main` branch에 직접 commit한다.
- MUST NOT `develop` branch에 직접 feature 작업 commit을 누적한다.

## 3. 커밋 메시지 규칙

- MUST commit message는 변경 목적을 명확히 표현한다.
- MUST commit message는 하나의 변경 의도만 표현한다.
- MUST commit message는 영어 type prefix를 사용한다.
- MUST commit message summary는 영어 또는 한글을 사용할 수 있다.
- MUST commit message는 `type: summary` 형식을 따른다.
- MUST 자동 생성 커밋 메시지 사용을 허용한다.
- MUST type은 `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`, `build`, `ci`, `revert` 중 하나를 사용한다.
- MUST commit 단위는 review 가능한 작업 단위로 분리한다.
- MUST 문서 변경 commit은 문서 변경 목적을 드러낸다.
- MUST UI 변경 commit은 사용자에게 보이는 변경 범위를 드러낸다.
- MUST API 연동 변경 commit은 대상 API 책임을 드러낸다.
- MUST NOT 의미 없는 commit message를 사용한다.
- MUST NOT 서로 다른 책임의 변경을 하나의 commit에 섞는다.
- MUST NOT secret, credential, token 값을 commit message에 포함한다.

### 3.1. 커밋 메시지 type 기준

- `feat`: 사용자 기능 또는 API 기능 추가
- `fix`: 버그 수정
- `refactor`: 동작 변경 없는 구조 개선
- `docs`: 문서 변경
- `style`: 포맷 또는 UI 스타일 변경
- `chore`: 설정, 의존성, 기타 작업
- `test`: 테스트 추가 또는 수정
- `build`: 빌드 설정 변경
- `ci`: CI 설정 변경
- `revert`: 이전 커밋 되돌림

### 3.2. 커밋 메시지 예시

```txt
docs: 프론트엔드 개발 문서 정리
chore: configure prettier and lint scripts
feat: 자산 등록 화면 추가
fix: API error handling 수정
```

## 4. Pull Request 규칙

- MUST PR은 단일 목적을 가진다.
- MUST PR 크기는 reviewer가 변경 의도와 영향을 추적할 수 있는 범위로 제한한다.
- MUST 대규모 변경은 독립적으로 검증 가능한 PR 단위로 분리한다.
- MUST PR 설명에 작업 목적을 포함한다.
- MUST PR 설명에 변경 범위를 포함한다.
- MUST PR 설명에 검증 결과를 포함한다.
- MUST PR 설명에 관련 문서 또는 이슈 링크를 포함한다.
- MUST PR 설명에 사용자 영향이 있는 변경 사항을 포함한다.
- MUST PR 설명에 미해결 사항이 있으면 명시한다.
- MUST PR 생성 전 local verification을 완료한다.
- MUST PR은 review 가능한 상태에서 생성한다.
- MUST 동작 변경이 있는 PR은 최소 1명 이상의 review 승인을 받는다.
- MUST review comment가 남아있는 상태에서 병합하지 않는다.
- MUST self-merge는 문서 전용 변경 또는 오탈자 수정처럼 동작 변경이 없는 PR에 한정한다.
- MUST self-merge 전 local verification 결과를 PR에 남긴다.
- MUST NOT 관련 없는 변경을 PR에 포함한다.
- MUST NOT 검증하지 않은 PR을 병합한다.
- MUST NOT 동작 변경이 있는 PR을 review 없이 self-merge한다.

## 5. 코드 리뷰 기준

- MUST review는 logic 정확성을 확인한다.
- MUST review는 frontend 구조와 책임 분리가 `docs/conventions/frontend-code-convention.md`를 따르는지 확인한다.
- MUST review는 코드 작성 스타일이 `docs/conventions/frontend-code-style.md`를 따르는지 확인한다.
- MUST review는 API 소비가 OpenAPI contract와 `docs/api/api-contract.md`를 따르는지 확인한다.
- MUST review는 도메인 규칙이 `docs/domain/README.md`를 따르는지 확인한다.
- MUST review는 실자산과 모의투자 domain state가 분리되어 있는지 확인한다.
- MUST review는 environment 값, secret, credential, token이 하드코딩되지 않았는지 확인한다.
- MUST review는 error, loading, empty state가 명확하게 분리되어 있는지 확인한다.
- MUST review는 불필요한 re-render를 유발하는 구조인지 확인한다.
- MUST review는 불필요한 network request가 발생하는지 확인한다.
- MUST review는 변경 의도와 코드 표현이 명확한지 확인한다.
- MUST review comment는 수정 필요 이유와 영향을 명확히 표현한다.
- MUST NOT formatter 또는 linter 담당 항목을 수동 취향 기준으로 판단한다.
- MUST NOT backend 책임 구현을 frontend PR에서 승인한다.

## 6. 환경변수 공통 원칙

- MUST 환경별 설정값은 env로 관리한다.
- MUST 민감한 설정값은 env 또는 승인된 secret 관리 수단으로 관리한다.
- MUST public env와 private env를 구분한다.
- MUST browser에 노출되는 값만 public env로 정의한다.
- MUST server runtime에서만 필요한 값은 private env로 정의한다.
- MUST env 값의 의미와 사용 위치는 코드에서 추적 가능해야 한다.
- MUST env 기본값에 secret, credential, token, 운영 설정값을 포함하지 않는다.
- MUST NOT env 값을 코드에 하드코딩한다.
- MUST NOT private env 값을 Client Component에서 참조한다.
- MUST NOT env 변수 목록이나 실제 값을 문서에 기록한다.

## 7. API Base URL 원칙

- MUST API Base URL은 env로 관리한다.
- MUST API Base URL은 환경별로 분리한다.
- MUST API client는 env에서 주입된 API Base URL을 기준으로 request를 구성한다.
- MUST API Base URL 사용 위치는 frontend API client 책임 안에 둔다.
- MUST NOT API Base URL을 코드에 하드코딩한다.
- MUST NOT component 또는 page에서 API Base URL 문자열을 직접 조합한다.
- MUST NOT backend endpoint 변경을 frontend 임의 규칙으로 보정한다.

## 8. 로컬 검증 규칙

- MUST PR 생성 전 local verification을 수행한다.
- MUST PR 생성 전 프로젝트에 정의된 통합 검증 script를 실행한다.
- MUST AI agent는 작업 후 변경 범위에 맞는 local verification을 수행한다.
- MUST local verification 결과를 PR 설명에 기록한다.
- MUST 변경 범위와 관련된 화면 또는 흐름을 직접 확인한다.
- MUST API 연동 변경은 contract 기준으로 request와 response shape을 확인한다.
- MUST env 변경이 필요한 작업은 public env와 private env 노출 범위를 확인한다.
- MUST 검증 실패 항목은 PR 설명에 남긴다.
- MUST 검증 실패 시 실패 원인에 해당하는 범위만 수정한다.
- MUST 추후 GitHub Actions는 local verification에 사용하는 프로젝트 script를 재사용한다.
- MUST NOT 검증 실패를 이유로 범위 밖 리팩토링을 수행한다.
- MUST NOT 검증 실패를 숨기고 PR을 병합한다.

## 9. 문서 참조 규칙

- MUST agent 작업 기준은 `AGENTS.md`를 따른다.
- MUST 기능 범위 판단은 `docs/project/mvp-scope.md`를 따른다.
- MUST API 작업은 `docs/api/api-contract.md`와 OpenAPI contract를 따른다.
- MUST domain 작업은 `docs/domain/README.md`를 따른다.
- MUST 보안 관련 작업은 `docs/security/security-guidelines.md`를 따른다.
- MUST frontend 구조와 책임 기준은 `docs/conventions/frontend-code-convention.md`를 따른다.
- MUST frontend 코드 작성 스타일 기준은 `docs/conventions/frontend-code-style.md`를 따른다.
- MUST 새 문서를 추가하거나 문서 위치를 변경할 때 `docs/README.md`를 함께 갱신한다.
- MUST 문서 간 규칙이 충돌할 경우 `AGENTS.md`를 우선한다.
- MUST domain, API, 기능 세부 규칙이 불명확할 경우 관련 `docs/`를 확인한다.
- MUST NOT 확인되지 않은 규칙을 문서 기준으로 확정한다.

## 10. 금지 패턴

- MUST NOT `main` branch에 직접 commit한다.
- MUST NOT `develop` branch에 직접 feature 작업 commit을 누적한다.
- MUST NOT PR에 관련 없는 변경을 포함한다.
- MUST NOT 검증하지 않은 PR을 병합한다.
- MUST NOT 동작 변경이 있는 PR을 review 없이 self-merge한다.
- MUST NOT secret, credential, token을 코드, commit message, PR 설명, 문서에 포함한다.
- MUST NOT API Base URL을 코드에 하드코딩한다.
- MUST NOT public env와 private env를 섞는다.
- MUST NOT private env 값을 browser에 노출한다.
- MUST NOT frontend repo에서 backend 책임을 구현한다.
- MUST NOT 실자산과 모의투자 domain state를 섞는다.
- MUST NOT 코드 스타일 또는 코드 구조 규칙을 이 문서에 중복 정의한다.
- MUST NOT 실행 명령어를 이 문서에 포함한다.
- MUST NOT env 변수 목록을 이 문서에 포함한다.
