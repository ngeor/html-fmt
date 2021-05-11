#!/usr/bin/env node

import { spawnSync } from "child_process";
import { readFileSync, writeFileSync, statSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { format, VoidTagsTrailingSlashStyle, FormatOptions, AttributeQuoteStyle } from "@ngeor/html-fmt-core";
import commander = require("commander");

interface Arguments {
    input: string;
    recursive: boolean;
    test: boolean;
    modify: boolean;
    indentSize: string;
    multilineAttributeThreshold: string;
    voidTagsTrailingSlashStyle: string;
    attributeQuoteStyle: string;
    preCommitHook: boolean;
}

function createFormatOptions(args: Arguments): Partial<FormatOptions> {
    let options: Partial<FormatOptions> = {};
    if (args.indentSize) {
        options.indentSize = parseInt(args.indentSize, 10);
    }

    if (args.multilineAttributeThreshold) {
        options.multilineAttributeThreshold = parseInt(args.multilineAttributeThreshold, 10);
    }

    if (args.voidTagsTrailingSlashStyle) {
        options.voidTagsTrailingSlashStyle = args.voidTagsTrailingSlashStyle as VoidTagsTrailingSlashStyle;
    }

    if (args.attributeQuoteStyle) {
        options.attributeQuoteStyle = args.attributeQuoteStyle as AttributeQuoteStyle;
    }

    return options;
}

function canParse(filename: string, args: Arguments): boolean {
    const data = readFileSync(filename, "utf8");
    try {
        format(data, createFormatOptions(args));
        return true;
    } catch (e) {
        return false;
    }
}

function formatInPlace(filename: string, args: Arguments) {
    const data = readFileSync(filename, "utf8");
    const formattedData = format(data, createFormatOptions(args));
    writeFileSync(filename, formattedData, "utf8");
}

function formatInStdOut(filename: string, args: Arguments) {
    const data = readFileSync(filename, "utf8");
    console.log(format(data, createFormatOptions(args)));
}

function processOneFile(filename: string, args: Arguments) {
    if (args.test) {
        const parseResult = canParse(filename, args);
        console.log(`${parseResult ? 'Y' : 'N'} ${filename}`);
    } else if (args.modify) {
        formatInPlace(filename, args);
    } else {
        formatInStdOut(filename, args);
    }
}

function processDirectory(args: Arguments) {
    const { preCommitHook } = args;
    if (preCommitHook) {
        processGitChanges(args);
    } else {
        walkDirectory(args);
    }
}

function processGitChanges(args: Arguments) {
    const { input } = args;
    const proc = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { cwd: input, encoding: 'utf8', stdio: 'pipe' });
    if (proc.status) {
        throw new Error(`Could not get git diff changes: ${proc.status} ${proc.stdout} ${proc.stderr}`);
    }

    const files = proc.stdout.split(/[\r\n]/).filter(f => f.endsWith(".tmpl") || f.endsWith(".inc") || f.endsWith(".html"));
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        processOneFile(join(input, file), args);
        gitAdd(file);
    }
}

function gitAdd(file: string) {
    const proc = spawnSync('git', ['add', file], { encoding: 'utf8', stdio: 'inherit'});
    if (proc.status) {
        throw new Error(`Could not git add ${file}`);
    }
}

function walkDirectory(args: Arguments) {
    const { input, recursive } = args;
    const files = readdirSync(input);
    files.filter(f => f.endsWith(".tmpl") || f.endsWith(".inc") || f.endsWith(".html"))
        .map(f => join(input, f))
        .forEach(f => processOneFile(f, args));

    if (recursive) {
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            const stat = statSync(join(input, element));
            if (stat.isDirectory()) {
                processDirectory({
                    ...args,
                    input: join(input, element)
                });
            }
        }
    }
}

function processFile(args: Arguments) {
    const { input } = args;
    processOneFile(input, args);
}

function main() {
    commander.option('-i, --input <filename>', 'The file or directory to format');
    commander.option('-m, --modify', 'Modify the file in-place');
    commander.option('-t, --test', 'Tests if the formatter can handle a file without errors');
    commander.option('-r, --recursive', 'Process directories recursively');
    commander.option('--indent-size <indent-size>', 'Indentation size', '4');
    commander.option(
        '--multiline-attribute-threshold <multiline-attribute-threshold>',
        'The number of attributes, inclusive, after which each attribute will be printed on its own line',
        '4');
    commander.option(
        '--void-tags-trailing-slash-style <void-tags-trailing-slash-style>',
        'Controls the trailing slash of void elements (br, hr, etc). Possible values: preserve, add, remove.',
        'remove'
    );
    commander.option(
        '--attribute-quote-style <attribute-quote-style>',
        'Controls the attribute quote style. Possible values: preserve, add.',
        'add'
    );
    commander.option('--pre-commit-hook', 'Runs as a git pre-commit hook, against the files reported by git diff --cached --name-only --diff-filter=ACMR');
    commander.parse(process.argv);
    const args : Arguments = commander as unknown as Arguments;
    const input: string = args.input;
    if (!input) {
        return commander.help();
    }

    if (!existsSync(input)) {
        console.error(`File ${input} not found`);
        return process.exit(1);
    }

    const stat = statSync(input);
    if (stat.isDirectory()) {
        return processDirectory(args);
    } else {
        return processFile(args);
    }
}

main();
