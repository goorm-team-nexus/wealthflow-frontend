# AGENTS.md

## 프로젝트 개요

Mock Investment & Portfolio Management Platform MVP의 Frontend 전용 repo.
Next.js App Router, TypeScript, TailwindCSS, shadcn/ui 기반.

## 규칙 기준

- MUST `AGENTS.md`는 전역 agent operating rules의 기준으로 간주한다.
- MUST 도메인/API/기능 세부 규칙은 `docs/`를 authoritative source로 간주한다.
- MUST agent operating rules가 다른 파일과 충돌할 경우 `AGENTS.md`를 따른다.
- MUST 도메인/API/기능 세부 규칙이 불명확하거나 충돌할 경우 관련 `docs/`를 우선 확인한다.

## 핵심 원칙

- MUST API 소비는 OpenAPI contract를 기준으로 한다.
- MUST App Router, UI, state management 범위에 집중한다.
- MUST 작업 전 관련 `docs/`를 우선 확인한다.
- SHOULD Next.js 동작이 불명확하면 공식 문서 또는 프로젝트 내 기존 구현 패턴을 확인한다.

## Hard Rules

- MUST 불명확하거나 범위를 벗어난 요구사항은 구현 전에 사용자에게 확인한다.
- MUST 작업 범위 판단은 `docs/project/mvp-scope.md`를 기준으로 한다.
- MUST 새로운 dependency를 임의로 추가하지 않는다.
- MUST dependency 추가가 필요한 경우 사용자 승인을 먼저 받아야 한다.
- MUST 기존 코드와 표준 라이브러리로 해결 가능한 경우 dependency 추가를 금지한다.
- MUST 새로운 파일이나 폴더를 임의로 생성하지 않는다.
- MUST 기존 코드와 구조를 우선적으로 수정한다.
- MUST 새로운 파일, 폴더 또는 구조 변경이 필요한 경우 사용자에게 먼저 확인한다.
- MUST 실자산과 모의투자 도메인의 balance, state, business logic을 섞지 않는다.
- MUST secret, credential, token을 하드코딩하거나 노출하지 않는다.
- MUST 작업 완료 후 변경 파일, 주요 변경 사항, 검증 결과를 요약한다.
- MUST NOT backend repo 책임을 구현한다.

## 문서 안내

- MUST 상세 규칙은 `docs/README.md`에서 필요한 문서만 찾아 확인한다.
- MUST `docs/`에 새 문서를 추가하거나 위치를 변경할 때 `docs/README.md`의 문서 링크를 함께 갱신한다.
- MUST 확정되지 않은 command를 임의로 실행하거나 정의하지 않는다.

## 문서 사용 기준

- MUST API 작업 시 `docs/api/README.md`를 확인한다.
- MUST 도메인 작업 시 `docs/domain/README.md`를 확인한다.
- MUST 기능 범위 판단 시 `docs/project/mvp-scope.md`를 확인한다.
