import * as vscode from 'vscode';

export const extensionShortName = 'cloak';
export const extensionId = 'johnpapa.vscode-cloak';

export const timeout = async (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const isObjectEmpty = (o: {} | undefined) => typeof o === 'object' && Object.keys(o).length === 0;
