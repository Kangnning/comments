import * as vscode from 'vscode';

export function moveCursorEOF(editor: vscode.TextEditor, lineNum: number) {
    const position: vscode.Position = editor.selection.active;
    const newPosition: vscode.Position = position.with(lineNum, 10000);
    editor.selection = new vscode.Selection(newPosition, newPosition);
}