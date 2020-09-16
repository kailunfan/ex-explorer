import * as vscode from 'vscode';

export class ExplorerFileItem extends vscode.TreeItem {

    command = {
        command: 'ex-explorer.openfile',
        title: '',
        arguments: [
            {
                'fullpath': this.fullpath
            }
        ]
    };

    constructor(
        public readonly label: string,
        public readonly fullpath: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.resourceUri = vscode.Uri.parse("file://" + fullpath);
        this.tooltip = fullpath;
    }

    contextValue = 'ExplorerFileItem';
}