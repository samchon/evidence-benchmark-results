# Screen plan

The frontend is a compact Reddit workspace organized around the requirements and the generated SDK operation inventory.

| Screen | Requirements | Actor | Operations | Journey |
| --- | --- | --- | --- | --- |
| Discover | community discovery, public popular feed, pagination, sort | public visitor | listCommunities, getCommunity, popularFeed | browse and open a community |
| Sign in / Join | registration, login, recovery | public visitor | join, login, recoveryRequest, recoveryComplete, refresh | create an account and sign in |
| Home | subscriptions and authenticated feed | authenticated user | homeFeed, subscriptions, subscribe, unsubscribe | subscribe, post, and return to feed |
| Community | community lifecycle, posts, comments, votes, reports | public/authenticated user | communityFeed, createPost, getPost, createComment, listComments, votePost, voteComment, report, deletePost, updatePost, deleteComment, updateComment | open, participate, and moderate content |
| Profile | public profile and authored content | public/authenticated user | profile, profilePage, updateProfile | inspect and edit profile |
| Moderation | roles, bans, report queues and history | owner/moderator | appointModerator, removeModerator, ban, unban, listBans, listBanHistory, listReports, listReportHistory, approve, dismiss, moderateDeletePost, moderateDeleteComment | resolve scoped moderation work |
| Account | password, sessions, deletion | authenticated user | changePassword, logout, logoutAll, deleteAccount | manage account lifecycle |

Every generated accessor is consumed by `src/lib/reddit/hooks.ts`; operations without a dedicated page are represented by an inline control in the owning screen.
