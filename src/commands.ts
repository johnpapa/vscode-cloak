import * as vscode from 'vscode';
import { updateColorConfiguration } from './configuration';
import { TextMateKeys } from './models';

export async function hideSecretsHandler() {
  const value = {
    textMateRules: [
      {
        scope: TextMateKeys.envKeys,
        settings: {
          foreground: '#19354900'
        }
      },
      {
        scope: TextMateKeys.envComments,
        settings: {
          foreground: '#19354900'
        }
      }
    ]
  };
  await updateColorConfiguration(value);
}

export async function showSecretsHandler() {
  const value = {};
  await updateColorConfiguration(value);
}
