// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Formatter, FormatOptions } from '@ngeor/html-fmt-core';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "html-fmt-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	disposable = vscode.languages.registerDocumentFormattingEditProvider('html', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const data = document.getText();
			if (!data || document.lineCount <= 0) {
				return [];
			}

			const firstLine = document.lineAt(0);
			const lastLine = document.lineAt(document.lineCount - 1);
			const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

			const configuration = vscode.workspace.getConfiguration("html-fmt-vscode");
			const options: Partial<FormatOptions> = {
				indentSize: configuration.get("indentSize") as number,
				multilineAttributeThreshold: configuration.get("multilineAttributeThreshold") as number,
				voidTagsTrailingSlashStyle: configuration.get("voidTagsTrailingSlashStyle"),
				attributeQuoteStyle: configuration.get("attributeQuoteStyle")
			};

			const formatter = new Formatter(data, options);
			let formatted = '';
			try {
				formatted = formatter.format();
				return [
					vscode.TextEdit.replace(
						range,
						formatted
					)
				];
			} catch (e) {
				console.error(e);
				vscode.window.showErrorMessage(`${e.message} at line ${formatter.parser.reader.row + 1} col ${formatter.parser.reader.col + 1}`);
				return [];
			}
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
