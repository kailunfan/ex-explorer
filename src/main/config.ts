import * as vscode from 'vscode';
import { Logger } from './logger';

export class Config {

    //Global Logger
    static logger = new Logger();

    //Conf Values
    private static conf_path: string = '.';
    private static conf_ignore_pattern: Array<string> = [];

    public static loadConfig() {
        this.logger.log("Loading Config");
        let conf = vscode.workspace.getConfiguration("ex-explorer");
        if (conf.path) {
            Config.conf_path = conf.path;
        }
        if (conf.ignorePattern) {
            Config.conf_ignore_pattern = conf.ignorePattern;
        }
        this.logger.log(Config.conf_path);
        this.logger.log(Config.conf_ignore_pattern.toString());

        let regex:RegExp = new RegExp('\\$\{(.*)\}(.*)');

        let res = regex.exec(Config.conf_path);
        if(res !== null){
            let res0 = res[1];
            let res1 = res[2];
            this.logger.log('path has workspacename : '+res0+' : '+res1);
            if(vscode.workspace.workspaceFolders){
                vscode.workspace.workspaceFolders.forEach((wkFolder) => {
                    this.logger.log(wkFolder.name);
                    if(wkFolder.name === res0){
                        this.logger.log('found workspace');
                        Config.conf_path = wkFolder.uri.fsPath + res1 ;
                    }
                });
            }
        }
        this.logger.log(Config.conf_path);
        this.logger.log("Loading Config - Completed");
    }

    public static get_conf_path() {
        return Config.conf_path;
    }

    public static get_conf_ignore_pattern() {
        return Config.conf_ignore_pattern;
    }

}