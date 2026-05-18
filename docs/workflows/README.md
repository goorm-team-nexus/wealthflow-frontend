# workflows

반복 작업의 절차 정의(workflow)를 정리하기 위한 문서.

## Scope

- MUST 이 문서는 AI agent가 반복 작업 절차를 수행할 때 적용한다.
- MUST workflow는 Antigravity, Claude, Codex 등 특정 agent에 종속되지 않는 공통 절차로 정의한다.
- MUST 문서 간 규칙이 충돌할 경우 `AGENTS.md`를 우선한다.

## Workflows

- `pr-draft` - 현재 작업 브랜치 기준 Pull Request 제목과 본문 초안 작성
  - Source: `.agents/workflows/pr-draft.md`
