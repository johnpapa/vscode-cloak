import {
  updateEditorTokenColorCustomization,
  getColorCustomizationConfig,
  getEnvironmentKeys,
  getEnvironmentComments,
  getTextMateRules,
  updateEnvironmentKeys,
  updateEnvironmentComments,
  getHideComments,
} from './configuration';
import { TextMateRulesNames, TextMateScopeDefaults } from './models';

interface ITextMateRule {
  name?: string;
  scope?: string | string[];
  settings?: Record<string, unknown>;
}

function hasRuleName(rule: unknown): rule is ITextMateRule & { name: string } {
  return typeof rule === 'object' && rule !== null && typeof (rule as ITextMateRule).name === 'string';
}

function isCloakRuleName(name: string) {
  return name === TextMateRulesNames.envKeys || name === TextMateRulesNames.envComments;
}

export async function restoreDefaultScopesHandler() {
  await updateEnvironmentKeys(TextMateScopeDefaults.envKeys);
  await updateEnvironmentComments(TextMateScopeDefaults.envComments);
}

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
    isHidingSecrets = textMateRules.some(
      rule => hasRuleName(rule) && rule.name === TextMateRulesNames.envKeys,
    );
  }
  return isHidingSecrets;
}

export async function hideSecretsHandler() {
  const envKeys = getEnvironmentKeys();
  const envComments = getEnvironmentComments();
  const existingRules = getTextMateRules();
  const hideComments = getHideComments();

  // remove existing rules for the cloak scopes
  const newRules = existingRules.filter(rule => {
    return !(hasRuleName(rule) && isCloakRuleName(rule.name));
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

  const value = {
    textMateRules: newRules,
  };

  await updateEditorTokenColorCustomization(value);
}

export async function showSecretsHandler() {
  const existingRules = getTextMateRules();
  let newRules = [];

  if (Array.isArray(existingRules)) {
    newRules = existingRules.filter(rule => {
      return !(hasRuleName(rule) && isCloakRuleName(rule.name));
    });
  }

  const value = {
    textMateRules: newRules,
  };

  await updateEditorTokenColorCustomization(value);
}
