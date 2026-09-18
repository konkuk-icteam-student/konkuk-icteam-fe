# 개발 파이프라인

이슈 등록부터 PR 리뷰까지, `.claude/commands`·`.claude/skills`에 구성된 Claude Code 커맨드와 스킬이 어디서 개입하는지 나타낸 다이어그램입니다.

![Claude Code 개발 파이프라인](images/dev-pipeline.svg)

`husky pre-commit` 게이트는 아직 이 저장소에 설정되어 있지 않은 예정 단계입니다 ([#2](https://github.com/konkuk-icteam-student/konkuk-icteam-fe/issues/2) 범위). 나머지 단계는 `.claude/commands`·`.claude/skills`에 실제로 구성되어 있습니다.
