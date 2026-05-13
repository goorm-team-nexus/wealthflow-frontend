# /pr-draft

현재 작업 브랜치 기준으로 GitHub Pull Request 제목과 본문 초안을 작성한다.

## Scope

- MUST Antigravity, Claude, Codex 등 AI agent 공통 PR draft workflow로 사용한다.
- MUST 실제 Pull Request를 생성하지 않는다.
- MUST commit, push, merge를 수행하지 않는다.
- MUST 파일을 생성하거나 수정하지 않는다.
- MUST 결과는 복사 붙여넣기 쉬운 형태로 응답한다.

## Required Reading

- MUST `AGENTS.md`를 확인한다.
- MUST PR/review 작업 기준으로 `docs/conventions/frontend-development-guide.md`를 확인한다.
- MUST `.github/pull_request_template.md`를 확인한다.

## Preflight

1. MUST 현재 브랜치를 확인한다.
2. MUST 현재 브랜치가 `main` 또는 `develop`이면 PR 초안을 작성하지 않고 중단 사유를 설명한다.
3. MUST `git fetch origin`으로 원격 `develop` 기준을 최신화한다.
4. MUST `git diff origin/develop...HEAD --name-only`로 현재 브랜치의 고유 변경 파일만 추출한다.
5. MUST `git log origin/develop..HEAD --oneline`으로 현재 브랜치에 포함된 커밋을 분석한다.
6. MUST 변경 파일이 없거나 PR로 올릴 내용이 거의 없으면 PR 초안을 작성하지 않고 중단 사유를 설명한다.

## Change Analysis

- MUST triple-dot diff 결과를 기준으로 현재 브랜치의 순수 변경사항만 요약한다.
- MUST 커밋 메시지와 변경 파일을 함께 보고 작업 의도를 판단한다.
- MUST 관련 없는 working tree 변경이나 `develop`에 이미 포함된 변경을 PR 내용에 포함하지 않는다.
- MUST secret, credential, token으로 보이는 값은 PR 본문에 포함하지 않는다.

## PR Title

- MUST 제목 형식은 `[태그] 작업내용 요약`을 사용한다.
- MUST 태그는 변경 의도에 맞춰 `[feat]`, `[fix]`, `[style]`, `[refactor]`, `[chore]`, `[docs]`, `[test]`, `[build]`, `[ci]` 중 하나를 사용한다.
- MUST 제목에 이모지를 사용하지 않는다.

## Template Rules

- MUST `.github/pull_request_template.md`의 모든 섹션 제목과 아이콘을 그대로 유지한다.
- MUST 템플릿 상단의 경고 문구를 삭제하거나 임의로 바꾸지 않는다.
- MUST 템플릿의 HTML 주석은 최종 출력에서 모두 삭제한다.
- MUST 사용되지 않는 섹션이라도 제목은 유지하고 내용은 `해당 사항 없음`으로 기재한다.
- MUST 체크리스트 항목을 임의로 체크하지 않는다.
- MUST 체크리스트는 템플릿에 있는 모든 항목을 `[ ]` 상태로 출력한다.

## UI Change Detection

- MUST 변경 파일 중 `.jsx`, `.tsx`, `.css`, `styles/` 경로, `app/` route UI 파일, `components/` 경로 파일이 포함되면 UI 작업으로 간주한다.
- MUST UI 작업인 경우 `🧪 검증 결과`의 `확인 경로`에 실제 확인할 수 있는 `/dev/...` 경로를 적는다.
- MUST UI 작업이지만 확인 경로를 변경사항만으로 확정할 수 없으면 `확인 경로: /dev/... 확인 필요`로 적는다.
- MUST UI 작업인 경우 `📸 스크린샷` 섹션에 `📸 스크린샷 첨부 필요 (첨부 후 이 문구 삭제)`를 적는다.
- MUST UI 작업이 아닌 경우 `확인 경로: 해당 사항 없음 (로직/문서 변경)`으로 적는다.
- MUST UI 작업이 아닌 경우 `📸 스크린샷` 섹션에 `해당 사항 없음`을 적는다.

## Verification Text

- MUST 실제로 실행하거나 확인한 검증만 `검증 결과`에 완료로 적는다.
- MUST 검증을 실행하지 않았으면 `결과: 미실행`과 미실행 사유를 적는다.
- MUST 실패한 검증이 있으면 실패 내용을 숨기지 않고 적는다.

## Output Format

- MUST `Preview`와 `Markdown Code Block` 두 형태를 모두 제공한다.
- MUST `Preview`에는 PR 제목과 PR 본문을 일반 Markdown으로 보여준다.
- MUST `Markdown Code Block`에는 PR 제목과 전체 본문을 복사 가능한 `markdown` fenced code block으로 제공한다.
