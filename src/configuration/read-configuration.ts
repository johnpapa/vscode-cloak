import * as vscode from 'vscode';
import { Sections } from '../models';

const { workspace } = vscode;

export function getColorCustomizationConfig() {
  return workspace.getConfiguration(Sections.editorTokenColorCustomizationSection);
}
