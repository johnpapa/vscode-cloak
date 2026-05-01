# Copilot Instructions — vscode-cloak

## Project Context

This is a **VS Code extension** (TypeScript, webpack-bundled) that hides/shows secrets in `.env` files using TextMateRule color manipulation. The `vscode` module is provided by the extension host at runtime and must be treated as an external dependency.

## Build & Validate

```bash
npm install               # Install dependencies
npm run webpack           # Bundle for development
npm run lint              # ESLint check
npm test                  # Full test run (compile + webpack + vscode-test integration)
```

## Code Conventions

### TypeScript

- **Strict mode** is enabled — do not use `// @ts-ignore` or weaken type checks
- Use `async/await` for all VS Code API calls that return `Thenable`
- Use **barrel exports** (`index.ts`) for each module folder — import from the folder, not individual files
- Prefer **enums** in `src/models/enums.ts` over string literals for command IDs, setting names, and section names

### Extension Architecture

- **`package.json` is the single source of truth** for commands, settings, keybindings, and menus
- **`activate()`** in `extension.ts` must only register commands and initialize UI — keep it lightweight
- **No file I/O** — the extension must never read or write user files; it only manipulates VS Code settings via the configuration API
- All configuration changes must target `ConfigurationTarget.Global`
- The `Logger` class writes to a dedicated "Cloak" output channel — use it instead of `console.log`

### Adding a New Command

1. Add the command to `contributes.commands` in `package.json`
2. Add the command ID to the `Commands` enum in `src/models/enums.ts`
3. Create the handler function in `src/commands.ts`
4. Register it in `activate()` via `commands.registerCommand(Commands.newCommand, handler)`
5. Add to `contributes.menus.commandPalette` in `package.json` if it should appear there
6. Add a test in `src/test/suite/basic.test.ts` that validates the command exists

### Adding a New Setting

1. Add the setting to `contributes.configuration.properties` in `package.json`
2. Add the setting name to the `Settings` enum in `src/models/enums.ts`
3. Add a reader function in `src/configuration/read-configuration.ts`
4. Add an updater function in `src/configuration/update-configuration.ts`
5. Add the property to `ISettings` interface in `src/models/interfaces.ts`
6. Update test setup/teardown in `src/test/suite/lib/setup-teardown-test-suite.ts`

## Maintenance Matrix

| When this changes... | Also update... |
|---|---|
| `contributes.commands` in `package.json` | `Commands` enum, `extension.ts` (register), `commands.ts` (handler), `commandPalette` menu, tests |
| `contributes.configuration` in `package.json` | `Settings` enum, `ISettings` interface, `read-configuration.ts`, `update-configuration.ts`, test setup/teardown |
| `contributes.keybindings` in `package.json` | `README.md` (document the shortcut) |
| `Commands` enum in `enums.ts` | `package.json` (must match), `extension.ts`, `commands.ts` |
| `TextMateScopeDefaults` in `enums.ts` | `package.json` setting defaults (must match exactly) |
| `src/configuration/` reader/writer | `commands.ts` (if new config affects command behavior), tests |
| Webpack config changes | Verify `main` field in `package.json` still points to correct output |
| New source file in `src/` | Add to barrel export (`index.ts`) if in a module folder |

## Testing Conventions

- Tests are **integration tests** that run inside a VS Code instance via `vscode-test`
- Mocha `tdd` UI — use `suite()` and `test()`, not `describe()` and `it()`
- **Always save and restore settings** — use `setupTestSuite` / `teardownTestSuite` pattern
- Test that every command in `package.json` is actually registered at runtime
- Test that every setting in `package.json` exists in the configuration schema

## File Patterns

| Pattern | Convention |
|---|---|
| New module | Create a folder under `src/` with an `index.ts` barrel export |
| Configuration access | Reader in `read-configuration.ts`, writer in `update-configuration.ts` |
| Constants/IDs | Define in `src/models/enums.ts`, never use inline string literals |
| Logging | Use `Logger.info()` from `src/logging.ts` |

## What NOT to Do

- Do not import `vscode` in webpack config or test runner — it's only available inside the extension host
- Do not use `console.log` in extension code — use `Logger`
- Do not modify user files from the extension — only manipulate VS Code settings
- Do not add runtime `dependencies` — everything must be `devDependencies` bundled by webpack (except `vscode` which is external)
