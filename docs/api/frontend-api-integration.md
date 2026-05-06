# Frontend API Integration

## Scope

- MUST 이 문서는 frontend repo의 API 호출, 인증 전달, 응답 변환, 에러 처리, mock data 사용 기준에 적용한다.
- MUST API contract 기준은 `docs/api/api-contract.md`와 OpenAPI contract를 따른다.
- MUST API client 구조는 `docs/conventions/frontend-code-convention.md`와 충돌하지 않아야 한다.
- MUST API Base URL과 env 기준은 이 문서를 따른다.

## Out of Scope

- MUST NOT 이 문서는 endpoint 목록을 나열한다.
- MUST NOT 이 문서는 특정 도메인 API 목록을 나열한다.
- MUST NOT 이 문서는 backend 구현 규칙을 정의한다.

## 1. API Base URL / env 규칙

- MUST 환경별 설정값은 env로 관리한다.
- MUST 민감한 설정값은 env 또는 승인된 secret 관리 수단으로 관리한다.
- MUST public env와 private env를 구분한다.
- MUST browser에 노출되는 값만 public env로 정의한다.
- MUST server runtime에서만 필요한 값은 private env로 정의한다.
- MUST env 값의 의미와 사용 위치는 코드에서 추적 가능해야 한다.
- MUST env 기본값에 secret, credential, token, 운영 설정값을 포함하지 않는다.
- MUST API Base URL은 env로 관리한다.
- MUST API Base URL은 환경별 env 값으로 분리한다.
- MUST API Base URL 조합은 API client 책임 안에서만 처리한다.
- MUST API client는 env에서 주입된 API Base URL을 기준으로 request URL을 구성한다.
- MUST browser에 노출되는 API Base URL만 public env로 정의한다.
- MUST server runtime에서만 필요한 API Base URL은 private env로 정의한다.
- MUST NOT env 값을 코드에 하드코딩한다.
- MUST NOT env 변수 목록이나 실제 값을 문서에 기록한다.
- MUST NOT API Base URL을 코드에 하드코딩한다.
- MUST NOT component 또는 page에서 API Base URL 문자열을 직접 조합한다.
- MUST NOT Client Component에서 private env 값을 참조한다.
- MUST NOT backend endpoint 변경을 frontend 임의 규칙으로 보정한다.

## 2. 인증 토큰 전달 방식

- MUST 인증 토큰 전달은 API client 책임으로 처리한다.
- MUST 인증이 필요한 request는 API client 또는 service 계층을 통해 생성한다.
- MUST API client는 프로젝트에서 정한 인증 흐름에 따라 token 전달 방식을 적용한다.
- MUST token, credential, secret, Authorization header는 로그에 출력하지 않는다.
- MUST NOT UI component에서 Authorization header를 직접 조합한다.
- MUST NOT page에서 Authorization header를 직접 조합한다.
- MUST NOT token, credential, secret을 코드에 하드코딩한다.
- MUST NOT token, credential, secret을 사용자에게 노출되는 error message에 포함한다.

## 3. API Client 구조

- MUST API 호출은 component 또는 page 내부가 아니라 API client 또는 service 계층에서 처리한다.
- MUST API endpoint, request, response, status code는 OpenAPI contract를 기준으로 사용한다.
- MUST request payload는 OpenAPI request schema와 일치해야 한다.
- MUST response payload는 OpenAPI response schema와 일치해야 한다.
- MUST API response는 UI model로 변환한 뒤 component에 전달한다.
- MUST raw response에서 UI model로 변환하는 로직은 service 또는 mapper 계층에 둔다.
- MUST component props는 UI 표시와 interaction에 필요한 model만 받는다.
- MUST API error는 UI에서 표시 가능한 error model로 변환한다.
- MUST NOT component 내부에 fetch, header, base URL, serialization 세부 구현을 작성한다.
- MUST NOT page 내부에 fetch, header, base URL, serialization 세부 구현을 작성한다.
- MUST NOT component가 raw API response shape에 직접 의존한다.
- MUST NOT page가 raw API response shape에 직접 의존한다.
- MUST NOT OpenAPI contract에 없는 field를 request 또는 response 처리 기준으로 임의 사용한다.

## 4. 에러 응답 처리

- MUST API error는 OpenAPI error shape을 기준으로 처리한다.
- MUST API error는 status code 기준으로 분기한다.
- MUST 네트워크 실패를 별도 error state로 구분한다.
- MUST 인증 실패를 별도 error state로 구분한다.
- MUST 권한 실패를 별도 error state로 구분한다.
- MUST validation 실패를 별도 error state로 구분한다.
- MUST 데이터 없음 상태를 error state와 구분한다.
- MUST API error는 사용자에게 표시 가능한 message로 변환한다.
- MUST 사용자 표시 message는 복구 action 판단에 필요한 수준으로 제한한다.
- MUST NOT 내부 endpoint를 사용자에게 노출한다.
- MUST NOT token, credential, secret을 사용자에게 노출한다.
- MUST NOT stack trace를 사용자에게 노출한다.
- MUST NOT OpenAPI error shape과 다른 임의 error shape을 API client 외부 계약으로 노출한다.

## 5. Mock Data 규칙

- MUST mock data는 명시된 mock 영역에서만 사용한다.
- MUST mock response shape은 OpenAPI response schema와 일치해야 한다.
- MUST mock error shape은 OpenAPI error shape과 일치해야 한다.
- MUST mock data 사용 여부는 코드에서 추적 가능해야 한다.
- MUST 실제 API가 존재하는 경우 mock data를 기본 request 결과로 사용하지 않는다.
- MUST mock data와 실제 API response를 동일한 UI model 변환 경로로 처리한다.
- MUST NOT component 내부에 임시 mock response를 작성한다.
- MUST NOT OpenAPI contract에 없는 field를 mock response에 추가한다.
- MUST NOT mock data로 domain state 또는 business result를 확정한다.

## 6. 문서 참조

- MUST API contract 기준은 `docs/api/api-contract.md`를 따른다.
- MUST frontend API client 구조는 `docs/conventions/frontend-code-convention.md`를 따른다.
- MUST API Base URL과 env 기준은 이 문서를 따른다.
- MUST 보안 관련 기준은 `docs/security/security-guidelines.md`를 따른다.
- MUST 기능 범위 판단은 `docs/project/mvp-scope.md`를 따른다.
- MUST 문서 간 규칙이 충돌할 경우 `AGENTS.md`를 따른다.
