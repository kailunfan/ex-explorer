import * as vscode from 'vscode';
import { Logger } from './logger';

export class Config {

    //Global Logger
    static logger = new Logger();

    //Conf Values
    private static conf_path: Array<string> = ["."];
    private static conf_ignore_pattern: Array<string> = [];
    private static conf_post_open_actions : Array<PostOpenAction> = [];

    public static loadConfig() {
        this.logger.log("Loading Config");
        let conf = vscode.workspace.getConfiguration("ex-explorer");
        if (conf.path) {
            if(!(conf.path instanceof Array)){
                vscode.window.showErrorMessage('ex-explorer : expected path as Array but found ' + conf.path);
                Config.conf_path = [conf.path+''];
            }else{
                Config.conf_path = conf.path;
            }
        }
        if (conf.ignorePattern) {
            Config.conf_ignore_pattern = conf.ignorePattern;
        }

        this.logger.log(Config.conf_ignore_pattern.toString());
        let regex:RegExp = new RegExp('\\$\{(.*)\}(.*)');

        for(var i=0;i<Config.conf_path.length;i++){
            this.logger.log('a '+Config.conf_path[i]);

            let res = regex.exec(Config.conf_path[i]);
            if(res !== null){
                let res0 = res[1];
                let res1 = res[2];
                this.logger.log('path has workspacename : '+res0+' : '+res1);
                if(vscode.workspace.workspaceFolders){
                    vscode.workspace.workspaceFolders.forEach((wkFolder) => {
                        this.logger.log(wkFolder.name);
                        if(wkFolder.name === res0){
                            this.logger.log('found workspace');
                            Config.conf_path[i] = wkFolder.uri.fsPath + res1 ;
                        }
                    });
                }
            }

            this.logger.log('b '+Config.conf_path[i]);
        }

        Config.conf_path.forEach( item => {
            this.logger.log(item);
        }); 

        if (conf.postOpenActions) {
            Config.conf_post_open_actions = conf.postOpenActions;
        }

        this.logger.log("Loading Config - Completed");
    }

    public static get_conf_path() {
        return Config.conf_path;
    }

    public static get_conf_ignore_pattern() {
        return Config.conf_ignore_pattern;
    }

    public static get_conf_post_open_actions() {
        return Config.conf_post_open_actions;
    }

}

interface PostOpenAction {
    filePattern : string,
    toggleWordWrap : boolean,
    scrollToBottom : boolean,
    decorations : [
        {
            regex : string,
            backgroundColor : string,
            color : string
        }
    ]
}