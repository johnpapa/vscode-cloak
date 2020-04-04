import { sep } from 'path';
import * as vscode from 'vscode';
import {
  getColorCustomizationConfig,
  getEnvironmentComments,
  getEnvironmentKeys,
  getHideComments,
  getTextMateRules,
  readConfiguration,
  updateEditorTokenColorCustomization,
  updateEnvironmentComments,
  updateEnvironmentKeys,
} from './configuration';
import { Logger } from './logging';
import { Sections, Settings, TextMateRulesNames, TextMateScopeDefaults } from './models';

export async function restoreDefaultScopesHandler() {
  await updateEnvironmentKeys(TextMateScopeDefaults.envKeys);
  await updateEnvironmentComments(TextMateScopeDefaults.envComments);
}

export async function toggleSecretsHandler() {
  const applyRegExp = (fileRegExp: string) => fileName && new RegExp(fileRegExp).test(fileName);
  const fileGlobs = readConfiguration<string[]>(Settings.Files);
  const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  const fileName = filePath?.split(sep).pop();
  let canProcessCurrentFile = true;

  Logger.info({ fileGlobs, fileName });

  try {
    if (Array.isArray(fileGlobs) && fileGlobs.length) {
      canProcessCurrentFile = !!fileGlobs.find(applyRegExp)?.length;
    } else if (typeof fileGlobs === 'string') {
      canProcessCurrentFile = !!applyRegExp(fileGlobs);
    } else if (typeof fileGlobs === 'undefined') {
      canProcessCurrentFile = true;
    } else {
      Logger.info(
        `Configuration "${Sections.cloakSection}.${Settings.Files}" should be either a glob or an array of globs.`,
      );
    }
  } catch (error) {
    Logger.info(error.toString());
    return;
  }

  if (canProcessCurrentFile) {
    if (secretsAreHidden()) {
      await showSecretsHandler();
    } else {
      await hideSecretsHandler();
    }
  } else {
    Logger.info(
      `Current file does not match the provided configuration in "${Sections.cloakSection}.${Settings.Files}".`,
    );
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
  const hideComments = getHideComments();

  // remove existing rules for the cloak scopes
  const newRules = existingRules.filter(el => {
    return ![TextMateRulesNames.envKeys, TextMateRulesNames.envComments].includes(el.name);
  });

  // add the envKeys scope
  newRules.push({
    name: TextMateRulesNames.envKeys,
    scope: envKeys,
    settings: {
      foreground: '#19354900',
    },
  });

  if (hideComments) {
    // add the envKeys scope
    newRules.push({
      name: TextMateRulesNames.envComments,
      scope: envComments,
      settings: {
        foreground: '#19354900',
      },
    });
  }

  const mergedTextMateRules: any = [...existingRules, ...newRules];

  const value = {
    textMateRules: mergedTextMateRules,
  };

  await updateEditorTokenColorCustomization(value);
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
    textMateRules: newRules,
  };

  await updateEditorTokenColorCustomization(value);
}
