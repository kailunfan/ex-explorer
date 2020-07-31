import * as vscode from 'vscode';
import { Config } from './main/config';
import { ViewProviders } from './main/viewProviders';
import { ExplorerHandler } from './main/explorer/explorerHandler';

export function activate(context: vscode.ExtensionContext) {

	Config.logger.log("Starting...");

	Config.loadConfig();
	ViewProviders.setViews();
	ExplorerHandler.setCommands(context);

	Config.logger.log("Activated...");
}

export function deactivate() { }