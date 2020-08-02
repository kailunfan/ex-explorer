import * as vscode from 'vscode';

export class ExplorerFolderItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly fullpath: string,
        public readonly state: vscode.TreeItemCollapsibleState
    ) {
        super(label, state);
        this.resourceUri = vscode.Uri.parse("file://" + fullpath);
    }

    contextValue = 'ExplorerFolderItem';
}