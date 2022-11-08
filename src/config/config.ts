import * as vscode from 'vscode';

export type UserConf = {
    name: string;
    date: string;
    description: string;
    error: string;
};

export function getUserCustom(): UserConf {
    const setting: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("comments");
    const config: any = setting.userConf;
    let userCustom: UserConf = {
        name: "",
        date: "",
        description: "",
        error: ""
    };
    const interfaceKeys = Object.keys(userCustom);
    Object.keys(config).forEach(key => {
        if (interfaceKeys.indexOf(key) > -1) {
            userCustom[key as keyof typeof userCustom] = config[key];
        }
    });

    if (userCustom.date.length === 0) {
        const nowDate = new Date();
        userCustom.date = `${nowDate.getFullYear()
            .toString()}${(nowDate.getMonth() + 1)
                .toString()}${nowDate.getDate() + 1
                    .toString().padStart(2, "0")}`;
    }

    if (userCustom.name.length === 0) {
        userCustom.error = "config is error, name is null";
    }

    return userCustom;
}