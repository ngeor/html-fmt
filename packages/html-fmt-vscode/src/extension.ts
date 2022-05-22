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

	let disposable = vscode.languages.registerDocumentFormattingEditProvider('html', {
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
				attributeQuoteStyle: configuration.get("attributeQuoteStyle"),
                extraNonIndentingTags: configuration.get("extraNonIndentingTags")
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
                let msg = '';
                if (e instanceof Error) {
                    msg = e.message;
                }
				vscode.window.showErrorMessage(`${msg} at line ${formatter.parser.reader.row + 1} col ${formatter.parser.reader.col + 1}`);
				return [];
			}
		}
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
