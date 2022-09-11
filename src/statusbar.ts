import { StatusBarAlignment, window, StatusBarItem } from 'vscode';
import { Commands } from './models';

const _statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);

export const getStatusBarItem = () => {
  updateStatusBar();
  return _statusBarItem;
};

export function updateStatusBar() {
  const sb = _statusBarItem;
  sb.text = `$(eye) Cloak`;
  sb.command = Commands.toggleSecrets;
  sb.tooltip = 'Cloak the secrets';
  sb.show();
}
