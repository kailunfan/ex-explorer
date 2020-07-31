import * as vscode from 'vscode';

export class ExplorerFolderItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly fullpath: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.resourceUri = vscode.Uri.parse("file://" + fullpath);
    }

    contextValue = 'ExplorerFolderItem';
}