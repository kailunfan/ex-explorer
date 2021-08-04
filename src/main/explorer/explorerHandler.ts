import * as vscode from 'vscode';
import { Config } from '../config';
import { ViewProviders } from '../viewProviders';
import { Uri, window } from 'vscode';
import * as rimraf from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import { ExplorerFileItem } from './explorerFileItem';

export class ExplorerHandler {


    static setCommands(context: vscode.ExtensionContext) {

        const open_file = async (args: string) => {
            let uri = vscode.Uri.parse("file:" + args);
            Config.logger.log('Opening url ' + uri);
            let doc = await vscode.workspace.openTextDocument(uri);
            let editor = await vscode.window.showTextDocument(doc);

            for (var i = 0; i < Config.get_conf_post_open_actions().length; i++) {
                let action = Config.get_conf_post_open_actions()[i];
                if (new RegExp(action.filePattern).test(uri.fsPath)) {
                    if (action.toggleWordWrap) {
                        await vscode.commands.executeCommand('editor.action.toggleWordWrap');
                    }
                    if (action.scrollToBottom) {
                        await editor.revealRange(new vscode.Range(new vscode.Position(editor.document.lineCount - 2, 0), new vscode.Position(editor.document.lineCount - 1, 0)));
                    }
                    for (var j = 0; j < action.decorations.length; j++) {
                        let decorationType = vscode.window.createTextEditorDecorationType({
                            color: action.decorations[j].color,
                            backgroundColor: action.decorations[j].backgroundColor
                        });
                        let regex = action.decorations[j].regex;
                        this.applyDecorations(editor, regex, decorationType);
                    }
                }
            }
        };

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.openfile', async (item: ExplorerFileItem) => {
            await open_file(item.fullpath);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.refreshConfig', async () => {
            Config.loadConfig();
            ViewProviders.explorerViewProvider.refreshUI();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.openmysettings', async () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'ex-explorer');
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.deletefile', async (args) => {
            Config.logger.log('Deleting file ' + args.fullpath);
            rimraf.sync(args.fullpath);
            ViewProviders.explorerViewProvider.refreshUI();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.deletefolder', async (args) => {
            Config.logger.log('Deleting folder ' + args.fullpath);
            rimraf.sync(args.fullpath);
            ViewProviders.explorerViewProvider.refreshUI();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.revealinexplorer', async (args) => {
            let fullpath = args.fullpath;
            fullpath = fullpath.replace(/(\\|\/)[^\\\/]*?(\\|\/)\.\./, "");
            fullpath = fullpath.replace(/(\\|\/)[^\\\/]*?(\\|\/)\.\./, "");
            fullpath = fullpath.replace(/(\\|\/)[^\\\/]*?(\\|\/)\.\./, "");
            Config.logger.log('Revealing folder ' + args.fullpath + " :: " + fullpath);
            vscode.commands.executeCommand('revealFileInOS', Uri.file(fullpath));
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.addfile', async (args) => {
            const name: string | undefined = await window.showInputBox();
            if (!name || !name!.trim()) {
                return;
            }
            const file_path = path.join(args.fullpath, name!);
            fs.openSync(file_path, 'a');
            ViewProviders.explorerViewProvider.refreshUI();
            await open_file(file_path);
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.addfolder', async (args) => {
            const name: string | undefined = await window.showInputBox();
            if (!name || !name!.trim()) {
                return;
            }
            const file_path = path.join(args.fullpath, name!);
            fs.mkdirSync(file_path);
            ViewProviders.explorerViewProvider.refreshUI();
        }));

        context.subscriptions.push(vscode.commands.registerCommand('ex-explorer.renamefile', async (args: ExplorerFileItem) => {
            const parseUrl = path.parse(args.fullpath);
            const name: string | undefined = await window.showInputBox({ value: parseUrl.name + parseUrl.ext });
            if (!name || !name!.trim()) {
                return;
            }
            const new_path = path.join(parseUrl.dir, name!);
            fs.renameSync(args.fullpath, new_path);
            ViewProviders.explorerViewProvider.refreshUI();
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