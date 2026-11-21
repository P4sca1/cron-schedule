# Changelog

## [v8.0.0](https://github.com/P4sca1/cron-schedule/releases/tag/v8.0.0)

[Compare to previous version](https://github.com/P4sca1/cron-schedule/compare/v7.0.0...v8.0.0)

### Features

- **BREAKING**: require TypeScript 5.0, publish to JSR, test on Deno and Bun (#377) ([c4b764c](https://github.com/P4sca1/cron-schedule/commit/c4b764cd5366b1012a60bebeea7c63c4614b6482))
- support time zones (#380) ([280f79b](https://github.com/P4sca1/cron-schedule/commit/280f79bdd046626c9126c025c9fbb499b5f6341d))

### Bug Fixes

- keep interval tasks ordered by deadline (#371) ([f3ccd15](https://github.com/P4sca1/cron-schedule/commit/f3ccd154010bac1ea134a1669b5b5baa745bc435))
- handle daylight saving time changes in getNextDate and getPrevDate (#376) ([8bf940c](https://github.com/P4sca1/cron-schedule/commit/8bf940cf2411fcbfa6d02a621e425b53ca861572))

Release notes for versions up to v7.0.0 are available on [GitHub Releases](https://github.com/P4sca1/cron-schedule/releases).
