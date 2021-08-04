import * as vscode from 'vscode';
import { ExplorerViewProvider } from "./explorer/explorerViewProvider";

export class ViewProviders {
    static explorerViewProvider: ExplorerViewProvider;

    static explorerView: vscode.TreeView<any>;

    static setViews(): void {

        ViewProviders.explorerViewProvider = new ExplorerViewProvider();

        ViewProviders.explorerView = vscode.window.createTreeView('ex-explorer-explorer', {
            treeDataProvider: ViewProviders.explorerViewProvider
        });
    }
}