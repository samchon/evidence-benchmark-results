# Frontend Screen Plan

The product uses four screens. Authentication owns public account entry and
security actions; the profile screen owns the private identity; the Todo
screen owns active work and history; and the trash screen owns recovery and
terminal Todo deletion.

| Requirement | Screen | Actor | Operations | Journey |
| --- | --- | --- | --- | --- |
| REQ-AUTH-PROVISION | auth-page.tsx | anyone | join, login | account entry |
| REQ-AUTH-PROVISION-1 | auth-page.tsx | anyone | join | registration |
| REQ-AUTH-PROVISION-2 | auth-page.tsx | user | login | login |
| REQ-AUTH-SESSION | profile-page.tsx | user | refresh, logout, logoutAll | session security |
| REQ-AUTH-SESSION-1 | profile-page.tsx | user | refresh | session security |
| REQ-AUTH-SESSION-2 | profile-page.tsx | user | logout | session security |
| REQ-AUTH-SESSION-3 | profile-page.tsx | user | logoutAll | session security |
| REQ-AUTH-MANAGE | profile-page.tsx | user | password, recover, reset, account delete | account security |
| REQ-AUTH-MANAGE-1 | profile-page.tsx | user | password | password change |
| REQ-AUTH-MANAGE-2 | auth-page.tsx | user | recover, reset | recovery |
| REQ-AUTH-MANAGE-3 | profile-page.tsx | user | account delete | account deletion |
| REQ-AUTH-BOUNDARY | auth-page.tsx | user | auth lifecycle | account entry |
| REQ-AUTH-BOUNDARY-1 | auth-page.tsx | user | login, refresh | session security |
| REQ-AUTH-BOUNDARY-2 | auth-page.tsx | user | login, refresh | ownership |
| REQ-RULE-CREDENTIAL | auth-page.tsx | user | join, login, password, recover, reset | credential validation |
| REQ-RULE-CREDENTIAL-1 | auth-page.tsx | user | join, login, recover | credential validation |
| REQ-RULE-CREDENTIAL-2 | auth-page.tsx | user | join, password, reset | credential validation |
| REQ-RULE-CREDENTIAL-3 | auth-page.tsx | user | login | credential validation |
| REQ-RULE-CREDENTIAL-4 | auth-page.tsx | user | password, reset | credential validation |
| REQ-DOM-PROFILE | profile-page.tsx | user | profile view, update | profile |
| REQ-DOM-PROFILE-1 | profile-page.tsx | user | profile view, update | profile |
| REQ-DOM-PROFILE-2 | profile-page.tsx | user | profile view, account delete | profile |
| REQ-FUNC-PROFILE | profile-page.tsx | user | profile view, update | profile |
| REQ-FUNC-PROFILE-1 | profile-page.tsx | user | profile view | profile |
| REQ-FUNC-PROFILE-2 | profile-page.tsx | user | profile update | profile |
| REQ-RULE-PROFILE | profile-page.tsx | user | profile update | profile |
| REQ-RULE-PROFILE-1 | profile-page.tsx | user | profile update | profile |
| REQ-DOM-TODO | todo-page.tsx | user | create, list, detail | active work |
| REQ-DOM-TODO-1 | todo-page.tsx | user | create, list, detail | active work |
| REQ-DOM-TODO-2 | todo-page.tsx | user | create, list, detail | ownership |
| REQ-DOM-TODO-LIFE | todo-page.tsx | user | complete, incomplete, trash, history | active work |
| REQ-DOM-TODO-LIFE-1 | todo-page.tsx | user | complete, incomplete | active work |
| REQ-DOM-TODO-LIFE-2 | todo-page.tsx | user | list, detail | active work |
| REQ-DOM-TODO-LIFE-3 | trash-page.tsx | user | trash | recovery |
| REQ-DOM-TODO-LIFE-4 | trash-page.tsx | user | restore | recovery |
| REQ-DOM-TODO-LIFE-5 | trash-page.tsx | user | permanent delete | recovery |
| REQ-DOM-HISTORY | todo-page.tsx | user | history | history |
| REQ-DOM-HISTORY-1 | todo-page.tsx | user | history | history |
| REQ-DOM-HISTORY-2 | todo-page.tsx | user | history, trash, restore | history |
| REQ-FUNC-TODO | todo-page.tsx | user | create, list, detail, edit, complete, incomplete, trash | active work |
| REQ-FUNC-TODO-1 | todo-page.tsx | user | create | create |
| REQ-FUNC-TODO-2 | todo-page.tsx | user | list | browse |
| REQ-FUNC-TODO-3 | todo-page.tsx | user | detail | detail |
| REQ-FUNC-TODO-4 | todo-page.tsx | user | edit, history | edit |
| REQ-FUNC-TODO-5 | todo-page.tsx | user | complete | completion |
| REQ-FUNC-TODO-6 | todo-page.tsx | user | incomplete | completion |
| REQ-FUNC-TODO-7 | todo-page.tsx | user | trash | recovery |
| REQ-FUNC-HISTORY | todo-page.tsx | user | history | history |
| REQ-FUNC-HISTORY-1 | todo-page.tsx | user | history | history |
| REQ-FUNC-TRASH | trash-page.tsx | user | trash list, detail, restore, permanent delete | recovery |
| REQ-FUNC-TRASH-1 | trash-page.tsx | user | trash list | recovery |
| REQ-FUNC-TRASH-2 | trash-page.tsx | user | trash detail | recovery |
| REQ-FUNC-TRASH-3 | trash-page.tsx | user | restore | recovery |
| REQ-FUNC-TRASH-4 | trash-page.tsx | user | permanent delete | recovery |
| REQ-RULE-CONTENT | todo-page.tsx | user | create, edit | content validation |
| REQ-RULE-CONTENT-1 | todo-page.tsx | user | create, edit | content validation |
| REQ-RULE-CONTENT-2 | todo-page.tsx | user | create, edit | content validation |
| REQ-RULE-BROWSE | todo-page.tsx | user | list | browse |
| REQ-RULE-BROWSE-1 | todo-page.tsx | user | list, trash list | browse |
| REQ-RULE-BROWSE-2 | todo-page.tsx | user | list | browse |
| REQ-RULE-BROWSE-3 | todo-page.tsx | user | list | browse |
| REQ-RULE-BROWSE-4 | todo-page.tsx | user | list, trash list | browse |
| REQ-RULE-STATE | todo-page.tsx | user | edit, complete, incomplete, history | active work |
| REQ-RULE-STATE-1 | todo-page.tsx | user | detail, edit, complete, incomplete, trash | active work |
| REQ-RULE-STATE-2 | todo-page.tsx | user | complete, incomplete | completion |
| REQ-RULE-STATE-3 | todo-page.tsx | user | edit | edit |
| REQ-RULE-STATE-4 | todo-page.tsx | user | edit, history | edit |
| REQ-NFR-PRIVACY | todo-page.tsx | user | all private Todo operations | ownership |
| REQ-NFR-PRIVACY-1 | todo-page.tsx | user | all private Todo operations | ownership |
| REQ-NFR-INTEGRITY | todo-page.tsx | user | edit, history | integrity |
| REQ-NFR-INTEGRITY-1 | todo-page.tsx | user | edit, history | integrity |
| REQ-NFR-INTEGRITY-2 | trash-page.tsx | user | trash, restore, history | recovery |
| REQ-NFR-INTEGRITY-3 | trash-page.tsx | user | permanent delete | recovery |
