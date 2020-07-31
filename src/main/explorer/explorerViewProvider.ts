import * as vscode from 'vscode';
import { Config } from '../config';
import { ExplorerFolderItem } from './explorerFolderItem';
import { ExplorerFileItem } from './explorerFileItem';
import * as fs from 'fs';

export class ExplorerViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        if (!element) {
            return this.listChildren(Config.get_conf_path());
        } else {
            return this.listChildren(element.fullpath);
        }
    }
    listChildren(fullpath: string): Promise<Array<ExplorerFolderItem | ExplorerFileItem>> {
        return new Promise(async (resolve, reject) => {
            let retArr: Array<ExplorerFolderItem | ExplorerFileItem> = []
            try {
                fs.readdirSync(fullpath).forEach((file) => {

                    let newpath = fullpath + "/" + file;

                    if(this.checkIgnoreRegex(newpath)){

                        if (fs.lstatSync(newpath).isDirectory()) {
                            retArr.push(new ExplorerFolderItem(file, newpath));
                        } else {
                            retArr.push(new ExplorerFileItem(file, newpath));
                        }

                    }

                });
            } catch (error) {
                Config.logger.log('error ' + error);
                vscode.window.showErrorMessage('ex-explorer : ' + error);
            }
            resolve(retArr);
        });
    }
    refreshUI() {
        this._onDidChangeTreeData.fire(undefined);
    }
    checkIgnoreRegex(fullpath: string):boolean{
        let ret = true;
        Config.get_conf_ignore_pattern().forEach(element => {
            let regex:RegExp = new RegExp(element);
            if(regex.test(fullpath)){
                ret = false;
            }
        });
        return ret;
    }    
}