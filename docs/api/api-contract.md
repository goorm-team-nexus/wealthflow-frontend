# API Contract

## 기준

- MUST frontend API 소비는 OpenAPI contract를 기준으로 한다.
- MUST request, response, status code는 OpenAPI contract와 일치해야 한다.
- MUST OpenAPI 원본 contract는 `https://d3uib3r331utfe.cloudfront.net/v3/api-docs`를 기준으로 확인한다.
- MUST repo에 저장된 `docs/api/openapi.json`은 특정 시점의 pinned snapshot으로 취급한다.
- MUST `docs/api/openapi.json`은 원본 contract를 대체하지 않는다.
- MUST API 연동 작업 전 `npm run openapi:check`로 원격 contract와 snapshot 차이를 확인한다.
- MUST backend API 변경이 예정된 작업에서는 `npm run openapi:update`로 snapshot을 갱신하고 diff를 함께 검토한다.

## 최신화

- `npm run openapi:update`는 원격 OpenAPI JSON을 받아 key 정렬 후 `docs/api/openapi.json`에 저장한다.
- `npm run openapi:check`는 원격 OpenAPI JSON과 `docs/api/openapi.json`을 정규화해 비교한다.
- `npm run openapi:check`가 실패하면 원격 contract가 변경되었거나 local snapshot이 없는 상태로 간주한다.
