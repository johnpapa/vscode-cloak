import * as vscode from 'vscode';
const { commands, workspace } = vscode;
import { Logger } from './logging';
import { Commands } from './models';
import { hideSecretsHandler, showSecretsHandler } from './commands';

export function activate(context: vscode.ExtensionContext) {
  Logger.info('Hide Secrets is initialized.');

  registerCommands();
}

function registerCommands() {
  commands.registerCommand(Commands.hideSecrets, hideSecretsHandler);
  commands.registerCommand(Commands.showSecrets, showSecretsHandler);
}

export function deactivate() {}
