# Frontend screen plan

Each requirement section is intentionally mapped to the smallest screen that
exposes its user-visible behavior. The operation pages share a protected shell
so account authority, loading, empty, refusal, and recovery states remain
reachable while every API boundary stays behind a domain hook.

## Auth and account

- REQ-AUTH-BOUNDARY auth-page.tsx
- REQ-AUTH-BOUNDARY-1 auth-page.tsx
- REQ-AUTH-BOUNDARY-2 auth-page.tsx
- REQ-AUTH-MANAGE settings-page.tsx
- REQ-AUTH-MANAGE-1 settings-page.tsx
- REQ-AUTH-MANAGE-2 auth-page.tsx
- REQ-AUTH-MANAGE-3 settings-page.tsx
- REQ-AUTH-PROVISION auth-page.tsx
- REQ-AUTH-PROVISION-1 auth-page.tsx
- REQ-AUTH-PROVISION-2 auth-page.tsx
- REQ-AUTH-SESSION settings-page.tsx
- REQ-AUTH-SESSION-1 todo-page.tsx
- REQ-AUTH-SESSION-2 settings-page.tsx
- REQ-AUTH-SESSION-3 settings-page.tsx

## Domain and operations

- REQ-DOM-HISTORY todo-page.tsx
- REQ-DOM-HISTORY-1 todo-page.tsx
- REQ-DOM-HISTORY-2 todo-page.tsx
- REQ-DOM-PROFILE settings-page.tsx
- REQ-DOM-PROFILE-1 settings-page.tsx
- REQ-DOM-PROFILE-2 settings-page.tsx
- REQ-DOM-TODO todo-page.tsx
- REQ-DOM-TODO-1 todo-page.tsx
- REQ-DOM-TODO-2 todo-page.tsx
- REQ-DOM-TODO-LIFE todo-page.tsx
- REQ-DOM-TODO-LIFE-1 todo-page.tsx
- REQ-DOM-TODO-LIFE-2 todo-page.tsx
- REQ-DOM-TODO-LIFE-3 todo-page.tsx
- REQ-DOM-TODO-LIFE-4 trash-page.tsx
- REQ-DOM-TODO-LIFE-5 trash-page.tsx
- REQ-FUNC-HISTORY todo-page.tsx
- REQ-FUNC-HISTORY-1 todo-page.tsx
- REQ-FUNC-PROFILE settings-page.tsx
- REQ-FUNC-PROFILE-1 settings-page.tsx
- REQ-FUNC-PROFILE-2 settings-page.tsx
- REQ-FUNC-TODO todo-page.tsx
- REQ-FUNC-TODO-1 todo-page.tsx
- REQ-FUNC-TODO-2 todo-page.tsx
- REQ-FUNC-TODO-3 todo-page.tsx
- REQ-FUNC-TODO-4 todo-page.tsx
- REQ-FUNC-TODO-5 todo-page.tsx
- REQ-FUNC-TODO-6 todo-page.tsx
- REQ-FUNC-TODO-7 todo-page.tsx
- REQ-FUNC-TRASH trash-page.tsx
- REQ-FUNC-TRASH-1 trash-page.tsx
- REQ-FUNC-TRASH-2 trash-page.tsx
- REQ-FUNC-TRASH-3 trash-page.tsx
- REQ-FUNC-TRASH-4 trash-page.tsx

## Rules and non-functional behavior

- REQ-NFR-INTEGRITY todo-page.tsx
- REQ-NFR-INTEGRITY-1 todo-page.tsx
- REQ-NFR-INTEGRITY-2 trash-page.tsx
- REQ-NFR-INTEGRITY-3 trash-page.tsx
- REQ-NFR-PRIVACY settings-page.tsx
- REQ-NFR-PRIVACY-1 settings-page.tsx
- REQ-RULE-BROWSE todo-page.tsx
- REQ-RULE-BROWSE-1 todo-page.tsx
- REQ-RULE-BROWSE-2 todo-page.tsx
- REQ-RULE-BROWSE-3 todo-page.tsx
- REQ-RULE-BROWSE-4 todo-page.tsx
- REQ-RULE-CONTENT todo-page.tsx
- REQ-RULE-CONTENT-1 todo-page.tsx
- REQ-RULE-CONTENT-2 todo-page.tsx
- REQ-RULE-CREDENTIAL auth-page.tsx
- REQ-RULE-CREDENTIAL-1 auth-page.tsx
- REQ-RULE-CREDENTIAL-2 auth-page.tsx
- REQ-RULE-CREDENTIAL-3 auth-page.tsx
- REQ-RULE-CREDENTIAL-4 settings-page.tsx
- REQ-RULE-PROFILE settings-page.tsx
- REQ-RULE-PROFILE-1 settings-page.tsx
- REQ-RULE-STATE todo-page.tsx
- REQ-RULE-STATE-1 todo-page.tsx
- REQ-RULE-STATE-2 todo-page.tsx
- REQ-RULE-STATE-3 todo-page.tsx
- REQ-RULE-STATE-4 todo-page.tsx
