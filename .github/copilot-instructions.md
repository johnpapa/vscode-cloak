# Copilot Instructions — Cloak

## Project Type

This is a **VS Code extension** written in TypeScript. The `package.json` `contributes` field is the product spec — commands, settings, menus, and keybindings are all declared there.

## TypeScript Conventions

- Use `strict` mode (enforced by `tsconfig.json`)
- Prefer `async`/`await` over raw Promises
- Use the `vscode` namespace for all VS Code API calls — import as `import * as vscode from 'vscode'`
- Destructure `vscode` submodules at the top of a file when used repeatedly (e.g., `const { commands } = vscode`)
- Export functions and classes — avoid default exports
- Use enums for string constants (`Commands`, `Settings`, `Sections`) rather than raw strings

## Extension Patterns

- **Command handler pattern:** Each command handler is an exported async function in `src/commands.ts`, registered in `src/extension.ts` via `commands.registerCommand(Commands.enumValue, handler)`
- **Configuration access:** Always use the helpers in `src/configuration/` — never call `vscode.workspace.getConfiguration()` directly in command handlers
- **Re-export barrels:** Both `src/models/index.ts` and `src/configuration/index.ts` re-export all members. Import from the barrel (`'./models'`, `'./configuration'`) not from individual files
- **Status bar:** Single shared instance in `src/statusbar.ts` — left-aligned, uses Codicon `$(eye)`

## Code Style

- **Formatter:** Prettier — single quotes, trailing commas, 100-char line width, 2-space indent (see `.prettierrc.js`)
- **Linter:** ESLint with `@typescript-eslint` parser (see `.eslintrc`)
- Lint with `npm run lint`, auto-fix with `npm run lint-fix`

## Test Conventions

- **Runner:** Mocha with TDD UI (`suite`, `test`, `suiteSetup`, `suiteTeardown`)
- **Host:** Tests run inside a VS Code instance via `vscode-test` — they are integration tests, not unit tests
- **Test files:** Place tests in `src/test/suite/` with `.test.ts` suffix
- **Setup/teardown:** Use `setupTestSuite()` and `teardownTestSuite()` from `src/test/suite/lib/setup-teardown-test-suite.ts` to save and restore user settings
- **Assertions:** Use Node's built-in `assert` module
- Run with `npm test` (compiles first) or `npm run just-test` (assumes already compiled)

## Maintenance Matrix

| When this changes... | Also update... |
|---|---|
| New command added | `package.json` (`contributes.commands`, `contributes.menus`), `src/models/enums.ts` (`Commands` enum), `src/commands.ts` (handler), `src/extension.ts` (`registerCommands()`), `CHANGELOG.md`, `README.md` (Commands table) |
| New setting added | `package.json` (`contributes.configuration.properties`), `src/models/enums.ts` (`Settings` enum), `src/models/interfaces.ts` (`ISettings`), `src/configuration/read-configuration.ts`, `src/configuration/update-configuration.ts`, `src/test/suite/lib/setup-teardown-test-suite.ts`, `CHANGELOG.md`, `README.md` (Settings table) |
| TextMate scope changed | `src/models/enums.ts` (`TextMateScopeDefaults`), `package.json` (`contributes.configuration` defaults), `CHANGELOG.md` |
| Keybinding added/changed | `package.json` (`contributes.keybindings`), `README.md` |
| Build/bundler config changed | `webpack.config.js`, `tsconfig.json`, `.github/workflows/ci.yml`, `.github/workflows/copilot-setup-steps.yml` |
| New dependency added | `package.json`, `CHANGELOG.md` |
| Extension version bumped | `package.json` (`version`), `CHANGELOG.md` |
