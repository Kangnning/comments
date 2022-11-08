import * as vscode from 'vscode';

export function moveCursorEOF(editor: vscode.TextEditor, lineNum: number) {
    const position: vscode.Position = editor.selection.active;
    const newPosition: vscode.Position = position.with(lineNum, 10000);
    editor.selection = new vscode.Selection(newPosition, newPosition);
}

export function isValidKey(
    key: string | number | symbol,
    object: object
): key is keyof typeof object {
    return key in object;
}