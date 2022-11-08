import { UserConf, getUserCustom } from "../config/config";
import { FillTemplate, Template } from "./common";
// delete template
const oneDeleteTemplate: string = "/* delete by ${user} ${date} ${description} */";
const multipleDeleteTemplate: string = "/* delete by ${user} ${date} ${description} ${status} */";

// add template
const oneAddTemplate: string = "/* add by ${user} ${date} ${description} */";
const multipleAddTemplate: string = "/* add by ${user} ${date} ${description} ${status} */";

export class CTemplate extends Template {
    constructor(option: string, isMultiple: boolean, status: string, spaceNum: number) {
        super(option, isMultiple, status, spaceNum);
    };
    getTemplate(): string {
        const userCustom: UserConf | string = getUserCustom();
        if (userCustom.error.length !== 0) {
            return userCustom.error;
        }

        const fill: CFillTemplate = new CFillTemplate(this.option, this.status, this.spaceNum);
        if (this.option === "delete") {
            if (this.isMultiple) {
                return fill.fillTemplate(multipleDeleteTemplate, userCustom);
            } else {
                return fill.fillTemplate(oneDeleteTemplate, userCustom);
            }
        } else if (this.option === "add") {
            if (this.isMultiple) {
                return fill.fillTemplate(multipleAddTemplate, userCustom);
            } else {
                return fill.fillTemplate(oneAddTemplate, userCustom);
            }
        }

        return "Sorry, we can't support this option";
    }
}

class CFillTemplate implements FillTemplate {
    option: string;
    status: string;
    spaceNum: number;
    constructor(option: string, status: string, spaceNum: number) {
        this.option = option;
        this.status = status;
        this.spaceNum = spaceNum;
    };

    fillTemplate(template: string, userCustom: UserConf): string {
        // 按照settings.json里的配置修改模板
        let comment: string = template.replace("${user}", userCustom.name);
        comment = comment.replace("${date}", userCustom.date);
        comment = comment.replace("${status}", this.status);

        // 对description进行单独控制
        if (userCustom.description.length !== 0) {
            comment = comment.replace("${description}", userCustom.description);
        } else {
            comment = comment.replace("${description} ", "");
        }

        // 对前面空格的处理
        if (this.status.length !== 0) {
            comment = `${"".padEnd(this.spaceNum, " ")}${comment}`;
        }

        // 对多行add和delete的处理
        if (this.option === "add" && this.status === "begin") {
            comment = `${comment}\n${comment.replace("begin", "end")}`;
        } else if (this.option === "delete" && this.status === "begin") {
            comment = `${comment}\n${"".padEnd(this.spaceNum, " ")}#if 0\n`;
        } else if (this.option === "delete" && this.status === "end") {
            comment = `\n${"".padEnd(this.spaceNum, " ")}#endif\n${comment}`;
        }


        return comment;
    };
};