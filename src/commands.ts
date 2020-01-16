import * as vscode from 'vscode';
import { updateColorConfiguration } from './configuration';

export async function hideSecretsHandler() {
  await updateColorConfiguration(' tbd ');
}
