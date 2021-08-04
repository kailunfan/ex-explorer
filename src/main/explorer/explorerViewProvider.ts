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
        if (element) {
            return this.listChildren(element.fullpath);
        }
        let retArr: Array<ExplorerFolderItem | ExplorerFileItem> = [];
        Config.get_conf_path().forEach(item => {
            let fullpath = item;
            let name = item.replace(/.*(\\|\/)/, "");
            retArr.push(new ExplorerFolderItem(name, fullpath, vscode.TreeItemCollapsibleState.Expanded));
        });
        return retArr;
    }

    async listChildren(fullpath: string): Promise<Array<ExplorerFolderItem | ExplorerFileItem>> {
        let retArr: Array<ExplorerFolderItem | ExplorerFileItem> = [];
        let files = fs.readdirSync(fullpath);
        files.sort((a: any, b: any) => {
            if (fs.lstatSync(fullpath + "/" + a).isDirectory() && !fs.lstatSync(fullpath + "/" + b).isDirectory()) {
                return -100;
            }
            if (!fs.lstatSync(fullpath + "/" + a).isDirectory() && fs.lstatSync(fullpath + "/" + b).isDirectory()) {
                return 100;
            }
            return b.localeCompare(a, 'zh-CN', { numeric: true });
        });
        for (const file of files) {
            let newpath = fullpath + "/" + file;
            if (this.checkIgnoreRegex(newpath)) {
                if (fs.lstatSync(newpath).isDirectory()) {
                    retArr.push(new ExplorerFolderItem(file, newpath, vscode.TreeItemCollapsibleState.Collapsed));
                } else {
                    retArr.push(new ExplorerFileItem(file, newpath));
                }
            }
        };
        return retArr;
    }

    refreshUI() {
        this._onDidChangeTreeData.fire(undefined);
    }

    checkIgnoreRegex(fullpath: string): boolean {
        let ret = true;
        Config.get_conf_ignore_pattern().forEach(element => {
            let regex: RegExp = new RegExp(element);
            if (regex.test(fullpath)) {
                ret = false;
            }
        });
        return ret;
    }
}