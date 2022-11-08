import { UserConf } from "../config/config";

export class Template {
    option: string;
    isMultiple: boolean;
    status: string;
    spaceNum: number;
    constructor(option: string, isMultiple: boolean, status: string, spaceNum:number) {
        this.option = option;
        this.isMultiple = isMultiple;
        this.status = status;
        this.spaceNum = spaceNum;
    };

    getTemplate(): string {
        return "";
    }
}

export interface FillTemplate {
    option: string;
    status: string;
    spaceNum: number;
    fillTemplate(template: string, userCustom: UserConf): string;
}