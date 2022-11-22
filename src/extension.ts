// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { languageMap } from './template';
import Template from "./template";
import { moveCursorEOF, searchChar } from './util';

interface InitObject {
	editor: vscode.TextEditor | undefined,
	active: vscode.Position | undefined,
	anchor: vscode.Position | undefined,
	option: string
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comments" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let deleteComment = vscode.commands.registerCommand('comments.delete', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const obj = getSelectionLine();
		if (typeof obj.editor === "undefined") {
			vscode.window.showWarningMessage("Sorry, you don't have active text");
			return;
		}

		insertComment(obj, "delete");
	});

	let addComment = vscode.commands.registerCommand('comments.add', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const obj = getSelectionLine();
		if (typeof obj.editor === "undefined") {
			vscode.window.showWarningMessage("Sorry, you don't have active text");
			return;
		}

		insertComment(obj, "add");
	});

	let replace = vscode.commands.registerCommand('comments.replace', () => {
		replaceString();
	});

	context.subscriptions.push(deleteComment);
	context.subscriptions.push(addComment);
	context.subscriptions.push(replace);
}

// This method is called when your extension is deactivated
export function deactivate() { }

// 获取当前选中的active和anchor行，并将TextEditor同时返回
function getSelectionLine(): InitObject {
	const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
	const select: vscode.Selection | undefined = editor?.selection;
	const activeLine: vscode.Position | undefined = select?.active;
	const anchorLine: vscode.Position | undefined = select?.anchor;

	return {
		editor: editor,
		active: activeLine,
		anchor: anchorLine,
		option: ""
	};
}

function getSpaceNum(ob: InitObject): number {
	let currentLineRange: vscode.Range | undefined = ob.editor?.document.lineAt(ob.active?.line as number).range;
	let text: string = ob.editor?.document?.getText(currentLineRange) as string;
	// active line spaceNum
	let spaceNum: number = text.length - text.trimStart().length;
	if (ob.active?.line === ob.anchor?.line) {
		return spaceNum;
	} else {
		currentLineRange = ob.editor?.document.lineAt(ob.anchor?.line as number).range;
		text = ob.editor?.document?.getText(currentLineRange) as string;
		let tempNum: number = text.length - text.trimStart().length;
		return spaceNum < tempNum ? spaceNum : tempNum;
	}
}

// 处理编辑器添加注释功能
function insertComment(ob: InitObject, option: string) {
	const language: string = ob.editor?.document.languageId as string;
	const isMultiple: boolean = ob.active?.line !== ob.anchor?.line;
	const spaceNum: number = getSpaceNum(ob);
	const tplFunction: ((option: string, isMultiple: boolean, status: string,
		spaceNum: number) => Template) | undefined = languageMap.get(language);

	if (typeof tplFunction === "undefined") {
		vscode.window.showWarningMessage(`Sorry, we can't support ${language} language`);
	} else {
		if (!isMultiple) {
			const currentLineRange: vscode.Range | undefined = ob.editor?.document
				.lineAt(ob.active?.line as number).range;
			const text: string = ob.editor?.document?.getText(currentLineRange) as string;
			const tpl: Template = tplFunction(option, isMultiple, "", spaceNum);
			const comment: string = tpl.getTemplate();
			let index: number = text.trimStart().indexOf("/*");
			if (option === "delete") {
				if (index === 0) {
					vscode.window.showInformationMessage("这行已经被注释了");
				} else if (index === -1) {
					const replaceStr: string = `${"".padEnd(spaceNum, " ")}/* ${text.slice(spaceNum)} ${comment.slice(3)}`;
					ob.editor?.edit(editBuilder => editBuilder.replace(currentLineRange as vscode.Range, replaceStr));
					moveCursorEOF(ob.editor as vscode.TextEditor, ob.active?.line as number);
				} else {
					index = text.indexOf("/*");
					const replaceStr: string = `${"".padEnd(spaceNum, " ")} /* ${text
						.substring(spaceNum, index)} */ ${text.slice(index)} ${comment}`;
					ob.editor?.edit(editBuilder => editBuilder.replace(currentLineRange as vscode.Range, replaceStr));
					moveCursorEOF(ob.editor as vscode.TextEditor, ob.active?.line as number);
				}
			} else if (option === "add") {
				if (text.trimStart().length !== 0) {
					// const comment: string = tplFunction(option, isMultiple, "", spaceNum).getTemplate();
					ob.editor?.edit(editBuilder => editBuilder.insert(new vscode.Position(ob
						.active?.line as number, text.length + 1), comment));
					moveCursorEOF(ob.editor as vscode.TextEditor, ob.active?.line as number);
				} else {
					const comment: string = tplFunction(option, isMultiple, "begin", spaceNum).getTemplate();
					ob.editor?.edit(editBuilder => editBuilder.insert(new vscode.Position(ob
						.active?.line as number, 0), comment));
					moveCursorEOF(ob.editor as vscode.TextEditor, ob.active?.line as number);
				}
			}
		} else {
			if (option === "add") {
				vscode.window.showWarningMessage("Sorry, we don't support multiple lines add comment");
			}

			if (typeof ob.active !== "undefined" && typeof ob.anchor !== "undefined") {
				const start: vscode.Position = ob.active.line > ob.anchor.line ? ob.anchor : ob.active;
				const end: vscode.Position = ob.active.line < ob.anchor.line ? ob.anchor : ob.active;
				const endLineRange: vscode.Range | undefined = ob.editor?.document.lineAt(end.line).range;
				const endLineCharacter: number | undefined = ob.editor?.document.getText(endLineRange).length;

				let comment: string = tplFunction(option, isMultiple, "begin", spaceNum).getTemplate();
				ob.editor?.edit(editBuilder => editBuilder.insert(new vscode.Position(start
					.line, 0), comment)).then(success => {
						if (success) {
							comment = tplFunction(option, isMultiple, "end", spaceNum).getTemplate();
							ob.editor?.edit(editBuilder => editBuilder.insert(new vscode.Position(end
								.line + 2, endLineCharacter as number), comment));
						}
					});
				moveCursorEOF(ob.editor as vscode.TextEditor, end.line + 4);
			}
		}
	}
};

// 处理替换字符串问题
function replaceString() {
	vscode.window.showInputBox({
		'title': 'comments.replace',
		'placeHolder': `格式为'(\$($start:$end/))?$src/$des(/g)?`,
		'prompt': `start和end为开始结束行号,不写默认为当前光标所在行. '/g'填写则为全量替换,不写则只替换第一个出现的`
	}).then(async input => {
		if (typeof input === "undefined") {
			vscode.window.showErrorMessage("No Input");
			return;
		}

		// 去除前后空格并定义需要替换的字符串和替换后的字符串
		input = input.trimStart().trimEnd();
		let globalReplace: boolean = false;
		let beforeReplace: string;
		let afterReplace: string;
		if (input.slice(-2) === "/g") {
			globalReplace = true;
		}

		// 获取该输入中有多少个“/”
		let slashIndex: number[] = searchChar(input, "/");

		if (slashIndex.length < 1 || slashIndex.length > 3) {
			vscode.window.showErrorMessage('Input Error!');
			return;
		}

		// 定义TextEditor和selection
		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (typeof editor === "undefined") {
			vscode.window.showErrorMessage("System Error");
			return;
		}
		const select: vscode.Selection = editor.selection;

		// 定义开始行和结束行
		let start: number = -1;
		let end: number = -1;

		if (input[0] === "$") {
			const colonIndex: number = input.indexOf(":");
			if (colonIndex === -1) {
				start = parseInt(input.substring(1, slashIndex[0])) - 1;
				if (start === NaN) {
					vscode.window.showErrorMessage("Input Error!");
					return;
				}
				end = start;
			} else {
				start = parseInt(input.substring(1, colonIndex)) - 1;
				if (start === NaN) {
					vscode.window.showErrorMessage("Input Error!");
					return;
				}

				end = parseInt(input.substring(colonIndex + 1, slashIndex[0])) - 1;
				if (end === NaN) {
					vscode.window.showErrorMessage("Input Error!");
					return;
				}
			}
			beforeReplace = input.substring(slashIndex[0] + 1, slashIndex[1]);
			afterReplace = input.substring(slashIndex[1] + 1, slashIndex[2] ? slashIndex[2] : undefined);
		} else {
			if (typeof select === "undefined") {
				vscode.window.showErrorMessage("This is a system error!");
				return;
			}
			const activeLine: vscode.Position = select.active;
			start = activeLine.line;
			end = start;

			beforeReplace = input.substring(0, slashIndex[0]);
			afterReplace = input.substring(slashIndex[0] + 1, slashIndex[1] ? slashIndex[1] : undefined);
		}

		// 如果开始行和结束行在同一行
		let replaceText: string;
		let flag: boolean = false;
		if (start === end) {
			const currentLineRange: vscode.Range = editor.document.lineAt(start).range;
			const text: string = editor.document.getText(currentLineRange);
			if (globalReplace) {
				replaceText = text.replaceAll(beforeReplace, afterReplace);
			} else {
				replaceText = text.replace(beforeReplace, afterReplace);
			}
			editor.edit(editBuilder => editBuilder.replace(currentLineRange, replaceText));
			moveCursorEOF(editor, start);
		} else {
			while (start <= end) {
				const currentLineRange: vscode.Range = editor.document.lineAt(start).range;
				const text: string = editor.document.getText(currentLineRange);
				console.log(text);
				if (globalReplace) {
					replaceText = text.replaceAll(beforeReplace, afterReplace);
				} else {
					replaceText = text.replace(beforeReplace, afterReplace);
					if (replaceText !== text) { flag = true; }
				}
				await editor.edit(editBuilder => editBuilder.replace(currentLineRange, replaceText));
				start++;
				if (flag) { break; }
			}
			moveCursorEOF(editor, start - 1);
		}

	});
};