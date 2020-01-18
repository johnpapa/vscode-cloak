import * as vscode from 'vscode';
import { Sections, Settings } from '../models';

const { workspace } = vscode;

export function getColorCustomizationConfig() {
  return workspace.getConfiguration(Sections.editorTokenColorCustomizationSection);
}

export function getTextMateRules() {
  const editorTokensSection = getColorCustomizationConfig();
  const textMateRules = editorTokensSection.get<any[] | undefined>('textMateRules');
  return textMateRules || [];
}

export function getEnvironmentKeys() {
  return readConfiguration<string>(Settings.EnvironmentKeys, '');
}

export function getEnvironmentComments() {
  return readConfiguration<string>(Settings.EnvironmentComments, '');
}

export function readConfiguration<T>(setting: Settings, defaultValue?: T | undefined) {
  const value: T | undefined = workspace
    .getConfiguration(Sections.hideSecretsSection)
    .get<T | undefined>(setting, defaultValue);
  return value as T;
}
