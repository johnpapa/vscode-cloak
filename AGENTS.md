# AI Agent Guide — vscode-cloak

## Project Overview

**Cloak** is a VS Code extension that hides and shows secrets in `.env` files by manipulating TextMateRule token colors. It sets the foreground color to fully transparent (`#19354900`) so secrets become invisible without modifying file contents.

- **Publisher:** `johnpapa` | **Extension ID:** `johnpapa.vscode-cloak`
- **Extension dependency:** `mikestead.dotenv` (provides `.env` syntax scopes)

## Repository Structure

```
vscode-cloak/
├── src/
│   ├── extension.ts                 # activate() entry point — registers commands, shows status bar
│   ├── commands.ts                  # Command handlers: hide, show, toggle, restoreDefaultScopes
│   ├── statusbar.ts                 # Status bar item (eye icon, toggles secrets on click)
│   ├── logging.ts                   # Logger class — writes to "Cloak" output channel
│   ├── configuration/
│   │   ├── read-configuration.ts    # Read workspace settings (cloak.* and editor.tokenColorCustomizations)
│   │   ├── update-configuration.ts  # Write global configuration (settings + textMateRules)
│   │   └── index.ts                 # Re-exports
│   ├── models/
│   │   ├── constants.ts             # extensionShortName, extensionId, helpers
│   │   ├── enums.ts                 # Commands, Settings, Sections, TextMateRulesNames, TextMateScopeDefaults
│   │   ├── interfaces.ts            # ICommand, IConfiguration, ISettings
│   │   └── index.ts                 # Re-exports + getExtension()
│   └── test/
│       ├── runTest.ts               # Test runner — downloads VS Code, runs integration tests
│       ├── coverage.ts              # Istanbul coverage instrumentation
│       └── suite/
│           ├── index.ts             # Mocha test runner config (tdd UI, xunit reporter)
│           ├── basic.test.ts        # Activation, command registration, settings validation
│           ├── extension.test.ts    # Placeholder test suite
│           └── lib/
│               ├── constants.ts     # Test helpers (executeCommand)
│               └── setup-teardown-test-suite.ts  # Save/restore settings around test suites
├── dist/                            # Webpack output (git-ignored)
├── out/                             # TypeScript compiler output for tests (git-ignored)
├── resources/                       # Extension icon and screenshots
├── webpack.config.js                # Bundles src/extension.ts → dist/extension.js
├── tsconfig.json                    # TypeScript config (target: es6, strict: true)
├── .eslintrc                        # ESLint + @typescript-eslint + prettier
├── package.json                     # Extension manifest (contributes, activation, scripts)
└── .vscode/
    ├── launch.json                  # "Run Extension" and "Extension Tests" debug configs
    ├── tasks.json                   # Build tasks
    ├── settings.json                # Workspace settings
    └── extensions.json              # Recommended extensions
```

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (strict mode, target ES6) |
| Bundler | Webpack 4 — `ts-loader`, target `node`, output `dist/extension.js` |
| Extension host | VS Code Extension API (`vscode` module, externalized by webpack) |
| Testing | Mocha (tdd UI) + `vscode-test` (integration tests in VS Code instance) |
| Coverage | Istanbul (`istanbul-lib-instrument`, `istanbul-lib-coverage`) |
| Linting | ESLint + `@typescript-eslint` + Prettier |
| Test doubles | Sinon.js |

## Architecture

### Activation

The extension activates on `*` (all activation events). `activate()` in `extension.ts`:
1. Registers four commands via `vscode.commands.registerCommand`
2. Creates and shows a status bar item (eye icon)

### Core Mechanism

Cloak manipulates `editor.tokenColorCustomizations.textMateRules` in VS Code's global settings:

- **Hide:** Adds textMateRules with foreground `#19354900` (fully transparent) for configured scopes
- **Show:** Removes Cloak's textMateRules entries (identified by `name: 'envKeys'` / `'envComments'`)
- **Toggle:** Checks if Cloak rules exist in current config, then calls show or hide

### Commands (package.json `contributes.commands`)

| Command ID | Handler | Behavior |
|---|---|---|
| `cloak.hideSecrets` | `hideSecretsHandler()` | Adds transparent textMateRules for env key scopes |
| `cloak.showSecrets` | `showSecretsHandler()` | Removes Cloak textMateRules |
| `cloak.toggleSecrets` | `toggleSecretsHandler()` | Toggles based on current state |
| `cloak.restoreDefaultScopes` | `restoreDefaultScopesHandler()` | Resets scope settings to defaults |

### Settings (package.json `contributes.configuration`)

| Setting | Type | Default | Purpose |
|---|---|---|---|
| `cloak.hideComments` | `boolean` | `false` | Also hide `.env` comments |
| `cloak.environmentKeys` | `string` | `string.quoted.single.ini,...` | TextMate scopes for values |
| `cloak.environmentComments` | `string` | `comment.line.number-sign.ini` | TextMate scope for comments |

### Keybinding

`Shift+Cmd+/` → `cloak.toggleSecrets`

## Build & Run

```bash
npm install               # Install dependencies
npm run webpack           # Bundle extension (development mode)
npm run watch             # Bundle with file watching
```

**Debug:** Open in VS Code → press F5 (uses "Run Extension" launch config → runs `npm run webpack` as pre-launch task).

## Testing

```bash
npm test                  # Compile TypeScript + webpack + run integration tests
npm run just-test         # Run tests only (assumes already compiled)
```

Tests run inside a VS Code instance via `vscode-test`. The test runner:
1. Downloads a VS Code binary
2. Opens the `./testworkspace` folder with extensions disabled
3. Runs Mocha in `tdd` UI mode

**Coverage:** `node ./out/test/runTest.js --coverage` (instruments via Istanbul, outputs to `out-cov/`).

**Key test patterns:**
- Tests use `suiteSetup`/`suiteTeardown` to save and restore VS Code settings
- `basic.test.ts` validates that commands and settings in `package.json` are actually registered
- Tests verify activation by checking `extension.isActive`

## Linting

```bash
npm run lint              # ESLint on src/
npm run lint-fix          # ESLint with auto-fix
```

## Key Conventions

- **`package.json` is the product spec** — commands, settings, keybindings, and menus are all declared there; source code must match exactly
- **Enums mirror `package.json`** — `Commands`, `Settings`, `Sections` in `src/models/enums.ts` must stay in sync with `contributes` declarations
- **No file modification** — the extension never reads or writes user files; it only manipulates VS Code settings
- **Global settings** — all configuration changes target `ConfigurationTarget.Global`
- **Barrel exports** — each module folder has an `index.ts` that re-exports everything

## Common Pitfalls

- **Enum ↔ package.json drift:** Adding a command in `package.json` without updating `Commands` enum (or vice versa) will cause runtime errors and test failures
- **TextMate scope changes:** The `TextMateScopeDefaults` enum must match `package.json` setting defaults exactly
- **Webpack externals:** The `vscode` module must remain external — importing it normally will break the bundle
- **Test environment:** Tests require a real VS Code instance (cannot run in pure Node.js); CI needs `xvfb` or similar on Linux
- **Extension dependency:** `mikestead.dotenv` must be installed for `.env` syntax scopes to exist
