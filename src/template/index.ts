import { CTemplate } from "./template-c";
import { Template } from "./common";

export default Template;
export const languageMap:Map<string, ((option:string, isMultiple: boolean, status: string, spaceNum: number) => Template)> = new Map(
    [["c", (option:string, isMultiple: boolean, status: string, spaceNum: number): CTemplate => new CTemplate(option, isMultiple, status, spaceNum)]]
);