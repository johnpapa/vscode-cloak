import * as vscode from 'vscode';
import { ConfigurationTarget } from 'vscode';
import { extensionShortName, Settings, Sections } from '../models';
import { Logger } from '../logging';

// export async function updateGlobalConfiguration<T>(setting: Settings, value?: any) {
//   const config = vscode.workspace.getConfiguration();
//   const section = `${extensionShortName}.${setting}`;
//   Logger.info(`${extensionShortName}: Updating the user settings with the following changes:`);
//   if (value && Array.isArray(value) && value.length > 0) {
//     Logger.info(value, true, `${extensionShortName}:  ${section}`);
//   } else {
//     Logger.info(`${extensionShortName}: ${section} = ${value}`, true);
//   }
//   return await config.update(section, value, ConfigurationTarget.Global);
// }

export async function updateColorConfiguration(colorCustomizations: {} | undefined) {
  Logger.info(`${extensionShortName}: Updating the workspace with the following color customizations`);
  Logger.info(colorCustomizations, true);
  return await vscode.workspace
    .getConfiguration()
    .update(Sections.colorCustomizationSection, colorCustomizations, ConfigurationTarget.Global);
}
