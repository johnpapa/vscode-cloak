import * as vscode from 'vscode';

export const extensionShortName = 'hide-secrets';
export const extensionId = 'johnpapa.vscode-hide-secrets';

export const timeout = async (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const isObjectEmpty = (o: {} | undefined) => typeof o === 'object' && Object.keys(o).length === 0;
