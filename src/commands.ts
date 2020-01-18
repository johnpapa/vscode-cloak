import * as vscode from 'vscode';
import {
  updateColorConfiguration,
  getColorCustomizationConfig,
  getEnvironmentKeys,
  getEnvironmentComments,
  getTextMateRules
} from './configuration';
import { TextMateRulesNames } from './models';

export async function toggleSecretsHandler() {
  if (secretsAreHidden()) {
    await showSecretsHandler();
  } else {
    await hideSecretsHandler();
  }
}

function secretsAreHidden() {
  let isHidingSecrets = false;
  const config = getColorCustomizationConfig();
  const textMateRules = config.get('textMateRules');
  if (Array.isArray(textMateRules)) {
    isHidingSecrets = !!textMateRules.find(el => {
      const name: string = el.name;
      return name.includes(TextMateRulesNames.envKeys);
    });
  }
  return isHidingSecrets;
}

export async function hideSecretsHandler() {
  const envKeys = getEnvironmentKeys();
  const envComments = getEnvironmentComments();
  const existingRules = getTextMateRules();
  const newRules = [
    {
      name: TextMateRulesNames.envKeys,
      scope: envKeys,
      settings: {
        foreground: '#19354900'
      }
    },
    {
      name: TextMateRulesNames.envComments,
      scope: envComments,
      settings: {
        foreground: '#19354900'
      }
    }
  ];

  const mergedTextMateRules: any = [...existingRules, ...newRules];

  const value = {
    textMateRules: mergedTextMateRules
  };

  await updateColorConfiguration(value);
}

export async function showSecretsHandler() {
  const existingRules = getTextMateRules();
  let newRules = [];

  if (Array.isArray(existingRules)) {
    newRules = existingRules.filter(el => {
      return ![TextMateRulesNames.envKeys, TextMateRulesNames.envComments].includes(el.name);
    });
  }

  const value = {
    textMateRules: newRules
  };

  await updateColorConfiguration(value);
}
