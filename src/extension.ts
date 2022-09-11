import * as vscode from 'vscode';
const { commands } = vscode;
import { Logger } from './logging';
import { Commands } from './models';
import {
  hideSecretsHandler,
  showSecretsHandler,
  toggleSecretsHandler,
  restoreDefaultScopesHandler,
} from './commands';
import { updateStatusBar } from './statusbar';

export function activate(context: vscode.ExtensionContext) {
  Logger.info('Cloak is initialized.');

  registerCommands();
  updateStatusBar();
}

function registerCommands() {
  commands.registerCommand(Commands.hideSecrets, hideSecretsHandler);
  commands.registerCommand(Commands.showSecrets, showSecretsHandler);
  commands.registerCommand(Commands.toggleSecrets, toggleSecretsHandler);
  commands.registerCommand(Commands.restoreDefaultScopes, restoreDefaultScopesHandler);
}
