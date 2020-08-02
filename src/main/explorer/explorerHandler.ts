import * as vscode from 'vscode';
import { Config } from '../config';
import { ViewProviders } from '../viewProviders';
import { ThemeColor } from 'vscode';

export class ExplorerHandler {


    static setCommands(context: vscode.ExtensionContext) {

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.openfile', async (args) => {
            let uri = vscode.Uri.parse("file:" + args.fullpath);
            Config.logger.log('Opening url ' + uri);
            let doc = await vscode.workspace.openTextDocument(uri);
            let editor = await vscode.window.showTextDocument(doc);

            for(var i=0;i<Config.get_conf_post_open_actions().length;i++){
                let action = Config.get_conf_post_open_actions()[i];
                if(new RegExp(action.filePattern).test(uri.fsPath)){
                    if(action.toggleWordWrap){
                        await vscode.commands.executeCommand('editor.action.toggleWordWrap');
                    }
                    if(action.scrollToBottom){
                        await editor.revealRange(new vscode.Range(new vscode.Position(editor.document.lineCount - 2, 0), new vscode.Position(editor.document.lineCount - 1, 0)));
                    }
                    for(var j=0;j<action.decorations.length;j++){
                        let decorationType = vscode.window.createTextEditorDecorationType({
                            color: action.decorations[j].color,
                            backgroundColor: action.decorations[j].backgroundColor
                        });
                        let regex = action.decorations[j].regex;
                        this.applyDecorations(editor, regex, decorationType);
                    }
                }
            }
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.refreshConfig', async () => {
            Config.loadConfig();
            ViewProviders.explorerViewProvider.refreshUI();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.openmysettings', async () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'ex-explorer');
        }));

    }

    static applyDecorations(editor: vscode.TextEditor, regex: string, decorationType: vscode.TextEditorDecorationType) {

        let decorationsArray1: vscode.DecorationOptions[] = [];

        let sourceCode = editor.document.getText();
        const sourceCodeArr = sourceCode.split('\n');

        for (let line = 0; line < sourceCodeArr.length; line++) {
            let match = sourceCodeArr[line].match(regex);

            if (line !== 0 && match !== null && match.index !== undefined) {
                let range = new vscode.Range(
                    new vscode.Position(line, match.index),
                    new vscode.Position(line, match.index + match[0].length)
                );
                decorationsArray1.push({ range });
            }
        }

        editor.setDecorations(decorationType, decorationsArray1);
    }
}