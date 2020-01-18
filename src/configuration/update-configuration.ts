import * as vscode from 'vscode';
import { ConfigurationTarget } from 'vscode';
import { extensionShortName, Sections, Settings } from '../models';
import { Logger } from '../logging';

export async function updateGlobalConfiguration<T>(setting: Settings, value?: any) {
  const config = vscode.workspace.getConfiguration();
  const section = `${extensionShortName}.${setting}`;
  Logger.info(`${extensionShortName}: Updating the settings with the following changes:`);
  if (value && Array.isArray(value) && value.length > 0) {
    Logger.info(value, true, `${extensionShortName}:  ${section}`);
  } else {
    Logger.info(`${extensionShortName}: ${section} = ${value}`, true);
  }
  return await config.update(section, value, ConfigurationTarget.Global);
}

export async function updateEditorTokenColorCustomization(colorCustomizations: {} | undefined) {
  Logger.info(`${extensionShortName}: Updating the settings with the following editor token color customizations`);
  Logger.info(colorCustomizations, true);
  return await vscode.workspace
    .getConfiguration()
    .update(Sections.editorTokenColorCustomizationSection, colorCustomizations, ConfigurationTarget.Global);
}

export async function updateEnvironmentKeys(envKeys: string) {
  return await updateGlobalConfiguration<string>(Settings.EnvironmentKeys, envKeys);
}

export async function updateEnvironmentComments(envComments: string) {
  return await updateGlobalConfiguration<string>(Settings.EnvironmentComments, envComments);
}
