import * as vscode from 'vscode';

export function moveCursorEOF(editor: vscode.TextEditor, lineNum: number) {
    const position: vscode.Position = editor.selection.active;
    const newPosition: vscode.Position = position.with(lineNum, 10000);
    editor.selection = new vscode.Selection(newPosition, newPosition);
}

export function searchChar(inputStr: string, character: string): number[] {
    if (character.length !== 1) {
        return [];
    }

    let indexList: number[] = [];
    let indexNumber: number = 0;
    for (let i=0;i<inputStr.length;i++) {
        if (inputStr[i] === character) {
            indexList[indexNumber] = i;
            indexNumber++;
        }
    }

    return indexList;
}