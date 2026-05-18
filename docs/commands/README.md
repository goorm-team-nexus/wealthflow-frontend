# commands

재사용 가능한 작업 단위(command)를 정리하기 위한 문서.

## Scope

- MUST 이 문서는 AI agent가 사용자 입력 command를 해석할 때 적용한다.
- MUST command는 Antigravity, Claude, Codex 등 특정 agent에 종속되지 않는 공통 작업 단위로 정의한다.
- MUST command의 상세 절차는 `docs/workflows/README.md`의 workflow를 따른다.
- MUST 문서 간 규칙이 충돌할 경우 `AGENTS.md`를 우선한다.

## Commands

- `/pr-draft` - 현재 작업 브랜치 기준 Pull Request 제목과 본문 초안 작성
  - Claude: `.claude/skills/pr-draft/SKILL.md`
  - Claude command compatibility: `.claude/commands/pr-draft.md`
  - Codex: `.agents/skills/pr-draft/SKILL.md`
  - Codex direct invocation: `$pr-draft`
  - Antigravity: `.agents/workflows/pr-draft.md`
