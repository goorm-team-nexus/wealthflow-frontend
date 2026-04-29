# Frontend Agent Guide

## Scope

- MUST 이 문서는 frontend repo에서 AI agent가 작업 전 확인할 문서를 선택하는 기준으로 사용한다.
- MUST 이 문서는 작업 유형별 기준 문서를 라우팅한다.
- MUST 이 문서는 frontend 작업, API 연동, UI/component 작업, state/form 작업, PR/review 작업에 적용한다.

## Out of Scope

- MUST NOT 이 문서는 세부 구현 규칙을 새로 정의한다.
- MUST NOT 이 문서는 코드 컨벤션, 코드 스타일, API contract, domain rule, PR rule을 중복 정의한다.
- MUST NOT 이 문서는 backend repo 책임을 정의한다.
- MUST NOT 이 문서는 실행 command를 정의한다.

## 문서 목적

- MUST 이 문서는 agent가 작업 전에 필요한 문서만 확인하도록 안내한다.
- MUST 이 문서는 라우터 문서로 유지한다.
- MUST 이 문서는 세부 규칙을 정의하지 않는다.
- MUST 이 문서는 기존 문서를 참조만 한다.
- MUST 세부 규칙은 연결된 기존 문서를 따른다.
- MUST 문서 간 규칙이 충돌할 경우 `AGENTS.md`를 따른다.

## Required Reading

- MUST 모든 작업 전 `AGENTS.md`를 확인한다.
- MUST 작업 유형에 따라 필요한 문서만 확인한다.
- MUST 필요한 문서 위치를 모를 경우 `docs/README.md`를 확인한다.

## Task Routing

- MUST UI/component 작업은 `docs/conventions/frontend-code-convention.md`와 `docs/conventions/frontend-code-style.md`를 확인한다.
- MUST App Router, page, layout 작업은 `docs/conventions/frontend-code-convention.md`를 확인한다.
- MUST API 연동 작업은 `docs/api/README.md`와 OpenAPI contract를 확인한다.
- MUST env 또는 API Base URL 작업은 `docs/conventions/frontend-development-guide.md`와 `docs/api/README.md`를 확인한다.
- MUST state 또는 form 작업은 `docs/conventions/frontend-code-convention.md`와 `docs/conventions/frontend-code-style.md`를 확인한다.
- MUST PR, review, check 작업은 `docs/conventions/frontend-development-guide.md`를 확인한다.
- MUST 보안 관련 작업은 `docs/security/security-guidelines.md`를 확인한다.
- MUST 도메인 규칙 판단은 `docs/domain/README.md`를 확인한다.
- MUST 디렉토리 구조 판단은 `docs/architecture/frontend-directory-structure.md`를 확인한다.
