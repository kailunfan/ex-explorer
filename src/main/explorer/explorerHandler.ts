import * as vscode from 'vscode';
import { Config } from '../config';
import { ViewProviders } from '../viewProviders';

export class ExplorerHandler {


    static setCommands(context: vscode.ExtensionContext) {

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.openfile', async (args) => {
            let uri = vscode.Uri.parse("file:" + args.fullpath);
            Config.logger.log('Opening url '+uri);
            let doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);            
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.refreshConfig', async () => {
            Config.loadConfig();
            ViewProviders.explorerViewProvider.refreshUI();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.openmysettings', async () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'ex-explorer');
        }));
        
    }
}