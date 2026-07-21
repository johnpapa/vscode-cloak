# Cloak — Agent Guide

Cloak is a **VS Code extension** that hides and shows secrets in environment files (`.env`). It manipulates TextMateRules to set the foreground color to transparent, so secrets are invisible while presenting, streaming, or recording.

## Repository Structure

```
vscode-cloak/
├── src/
│   ├── extension.ts              # Activation entry point, command registration
│   ├── commands.ts               # Command handlers (hide, show, toggle, restoreDefaults)
│   ├── statusbar.ts              # Status bar item (eye icon, toggle command)
│   ├── logging.ts                # Output channel logger
│   ├── configuration/
│   │   ├── index.ts              # Re-exports
│   │   ├── read-configuration.ts # Read VS Code settings and textMateRules
│   │   └── update-configuration.ts # Write VS Code settings
│   ├── models/
│   │   ├── index.ts              # Re-exports + getExtension() helper
│   │   ├── constants.ts          # extensionShortName, extensionId, utility fns
│   │   ├── enums.ts              # Commands, Settings, Sections, TextMateRulesNames, TextMateScopeDefaults
│   │   └── interfaces.ts         # ICommand, IConfiguration, ISettings
│   └── test/
│       ├── runTest.ts            # Test runner entry (vscode-test)
│       ├── coverage.ts           # Istanbul coverage instrumentation
│       └── suite/
│           ├── index.ts          # Mocha config (TDD UI, xunit reporter)
│           ├── basic.test.ts     # Extension activation, command/setting registration tests
│           ├── extension.test.ts # Placeholder test suite
│           └── lib/
│               ├── constants.ts          # Test helpers (executeCommand)
│               └── setup-teardown-test-suite.ts # Save/restore settings between tests
├── resources/                    # Extension icon and screenshots
├── dist/                         # Webpack output (not committed)
├── .vscode/                      # Dev environment (launch configs, tasks)
├── webpack.config.js             # Bundles src/extension.ts → dist/extension.js
├── tsconfig.json                 # TypeScript config (commonjs, es6, strict)
├── .eslintrc                     # ESLint + TypeScript parser
├── .prettierrc.js                # Prettier (single quotes, trailing commas, 100 width)
├── package.json                  # Extension manifest — commands, settings, menus, keybindings
├── CHANGELOG.md                  # Version history
├── README.md                     # User-facing docs
└── LICENSE.md                    # MIT
```

## Tech Stack

- **Language:** TypeScript
- **Runtime:** VS Code Extension Host (Node.js)
- **Bundler:** webpack (ts-loader)
- **Test runner:** Mocha (TDD UI) via `vscode-test`
- **Linter:** ESLint with `@typescript-eslint`
- **Formatter:** Prettier
- **Coverage:** Istanbul
- **Scope source:** TextMate scopes provided by VS Code for dotenv/INI grammars

## Build & Run

```bash
# Install dependencies
npm install

# Compile TypeScript + webpack bundle
npm run webpack

# Production bundle (used by vsce)
npm run vscode:prepublish

# Watch mode for development
npm run watch

# Package the extension (.vsix)
npm run package

# Publish to VS Code Marketplace
npm run publish
```

To debug locally, press `F5` in VS Code — this launches an Extension Development Host with the extension loaded (see `.vscode/launch.json`).

## Testing

```bash
# Full test: compile TypeScript → webpack → run Mocha in VS Code host
npm test

# Run tests only (skip compile, assumes already built)
npm run just-test
```

Tests run inside a VS Code instance via `vscode-test`. The test runner opens a `testworkspace` folder with extensions disabled. Tests use Mocha's TDD interface (`suite`, `test`, `suiteSetup`, `suiteTeardown`).

Key test file: `src/test/suite/basic.test.ts` — verifies extension activation, command registration against `package.json`, and setting registration.

## Key Patterns and Conventions

- **`package.json` is the product spec** — all commands, settings, menus, and keybindings are declared in `contributes`. This is the source of truth for what the extension exposes to users.
- **Command registration chain:** Commands are declared in `package.json` → enum IDs live in `src/models/enums.ts` (`Commands` enum) → handlers are in `src/commands.ts` → registration happens in `src/extension.ts` (`registerCommands()`).
- **Configuration pattern:** Settings are declared in `package.json` `contributes.configuration` → read via `src/configuration/read-configuration.ts` → written via `src/configuration/update-configuration.ts`. Setting keys are in the `Settings` enum.
- **TextMateRules mechanism:** Cloak works by injecting/removing TextMateRules into `editor.tokenColorCustomizations`. It sets foreground to `#19354900` (alpha 0 = transparent) to hide values. The scope defaults are in the `TextMateScopeDefaults` enum.
- **Re-export pattern:** Both `src/models/index.ts` and `src/configuration/index.ts` re-export all members from their submodules.
- **Status bar:** A left-aligned status bar item with an eye icon, bound to `toggleSecrets`.

## Adding a New Command

1. **Declare in `package.json`** — add to `contributes.commands` array with `command` ID and `title` (prefixed with `Cloak:`). Also add to `contributes.menus.commandPalette`.
2. **Add to `Commands` enum** in `src/models/enums.ts` — use the `cloak.yourCommand` naming pattern.
3. **Implement the handler** in `src/commands.ts` — export an async function.
4. **Register in `src/extension.ts`** — add `commands.registerCommand(Commands.yourCommand, yourHandler)` inside `registerCommands()`.
5. **Add keybinding** (optional) — add to `contributes.keybindings` in `package.json`.
6. **Add test** — verify the command exists in `src/test/suite/basic.test.ts` (the "Commands exist in package.json" test auto-checks all `Commands` enum members).
7. **Update `CHANGELOG.md`** with the new command.

## Adding a New Setting

1. **Declare in `package.json`** — add to `contributes.configuration.properties` with `cloak.settingName`, type, default, and description.
2. **Add to `Settings` enum** in `src/models/enums.ts`.
3. **Add reader** in `src/configuration/read-configuration.ts` — use `readConfiguration<T>(Settings.YourSetting, defaultValue)`.
4. **Add writer** (if needed) in `src/configuration/update-configuration.ts`.
5. **Update `ISettings` interface** in `src/models/interfaces.ts`.
6. **Update test setup/teardown** in `src/test/suite/lib/setup-teardown-test-suite.ts` to save/restore the new setting.

## Documentation

This project does not have a docs site — documentation is in `README.md`. For an extension of this scope, the README is sufficient.

## Common Pitfalls

- **Tests require a VS Code instance** — you cannot run `mocha` directly. Tests must run through `vscode-test` which downloads and launches a real VS Code instance.
- **Webpack must run before tests** — `npm test` handles this via `test-compile`, but if you run `just-test` alone, make sure you've already built.
- **`package.json` and enums must stay in sync** — if you add a command to `package.json` but forget the `Commands` enum (or vice versa), the `basic.test.ts` test will catch it.
- **Scope compatibility** — if a file type's grammar does not expose expected TextMate scopes, Cloak cannot hide those values. Inspect scopes with **Developer: Inspect Editor Tokens and Scopes**.
