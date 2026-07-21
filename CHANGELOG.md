# Change Log

All notable changes to the "vscode-cloak" extension will be documented in this file.

## Unreleased

- Fixed a crash path when toggling secrets with unexpected TextMate rule entries.
- Expanded default dotenv scopes so unquoted values are cloaked by default.
- Expanded default comment scopes and enabled comment cloaking by default to reduce accidental exposure from commented secrets.
- Removed obsolete extension dependency that could block activation in some environments.

## 0.5.0

- Added new scope for ini files using single and double quotes.
- Fixed "reset" command to now apply to ini files (which replaced the env previously)
- Added statusBar icon to toggle cloaking

## 0.4.1

- Added new scope for ini files. Fixes change to VS Code scopes where cloak was not hiding secrets.

## 0.3.0

- dotEnv extension is now a dependency of cloak

## 0.2.0

- Default settings now hide no quotes, double quoted, and single quoted values in the \*.env files
- Added more details to the _readme.md_

## 0.0.2

- Initial alpha release
