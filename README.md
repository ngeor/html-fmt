# html-fmt

> HTML formatter (pretty printer) supporting custom tags.


[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/NikolaosGeorgiou.html-fmt-vscode)](https://marketplace.visualstudio.com/items?itemName=NikolaosGeorgiou.html-fmt-vscode)

Available as a CLI app and a Visual Studio Code extension.

**Motivation**: to be able to pretty-print HTML files even if they contain
custom (e.g. server-side) tags.

## Packages

- `packages/html-fmt-core` contains the parser logic
- `packages/html-fmt-cli` is a CLI app
- `packages/html-fmt-vscode` is a Visual Studio Code formatting extension

## Download Visual Studio Code Extension

You can download the Visual Studio Code extension from the
[Marketplace](https://marketplace.visualstudio.com/items?itemName=NikolaosGeorgiou.html-fmt-vscode).

Then, install the vsix file with
`code --install-extension html-fmt-vscode-*.vsix`.

## CLI

The CLI can be used to format a single file or multiple files inside a
directory.

Requirements: nodeJS LTS.

Command line options:

- `-h, --help`: Print usage instructions
- `-i, --input <filename>`: Specify the file or directory to format. Note that
  for directories, only files ending in `html`, `inc` and `html` will be
  processed.
- `-r, --recursive`: Process directories recursively
- `-m, --modify`: Modifies the input file(s) in-place
- `-t, --test`: Do not format anything, just test if the formatter is able to
  format the input without throwing an error (useful for debugging)
- `--indent-size <indent-size>` Specify the indentation size. By default, it
  is 4.
- `--multiline-attribute-threshold <multiline-attribute-threshold>` The number
  of attributes, inclusive, after which each attribute will be printed on its
  own line. The default value is 4.
- `--void-tags-trailing-slash-style <void-tags-trailing-slash-style>` Controls
  the trailing slash of void elements (`br`, `hr`, etc). Possible values:
  preserve, add, remove. The default value is remove.
- `--attribute-quote-style <attribute-quote-style>` Controls the quotes of
  attribute values. Possible values: preserve, add. The default value is add.
- `--pre-commit-hook` Runs as a git pre-commit hook (inspired by
  [Prettier](https://prettier.io/docs/en/precommit.html#option-5-bash-script))
- `--extra-non-indenting-tags`: Pass HTML tags that should cause indentation to stay unchanged.

You can use the CLI with one of the following ways:

- `npx @ngeor/html-fmt-cli`
- `npm i -g @ngeor/html-fmt-cli` and then `html-fmt-cli`
- Clone the repository and install dependencies with `npm i`. Then, from the
  `packages/html-fmt-cli` folder, run `npm start -- <the cli options>`. Example:
  `npm start -- -i my-file.html -m`.

### Pre-commit hook

Save the following shell script as `.git/hooks/pre-commit` and give it execute
permission:

```sh
#!/bin/sh
npx @ngeor/html-fmt-cli --pre-commit-hook -m -i .
```

## Links

- [Packaging VS Code Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Prettier pre-commit hook](https://prettier.io/docs/en/precommit.html#option-5-bash-script)

## Supported Syntax

### HTML

Supported elements:

- `<!doctype>` declaration
- `<!-- hello -->` comments
- `<br>` void elements
- `<input required>` attributes without value
- `<div>hello</div>` elements with text

### TMPL

- `<~TMPL_V name ~>` whitespace trimming elements
- `## comment` server-side comments
- `<TMPL_INCLUDE a/file/somewhere>`
- `<TMPL_INCLUDE a/file type=[% expression %] id="hello">` attributes with Perl expressions
- Proper indentation for `<TMPL_IF>` and `<TMPL_ELSE>`
- Tags inside tags `<p <TMPL_IF condition>class="hi"</TMPL_IF>>`
- Tags inside attribute values `<p class="<TMPL_V foo escape=HTML>">`

## Developing

### Requirements

The project uses [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

### Bumping version

- Run `git-cliff -t x.y.z -o CHANGELOG.md`
- Run `npm version minor -ws`

### Publishing

- Publish with `npm publish -ws`

### Creating extension

You will need `vsce` (install with `npm i -g vsce`).
Run the following to be able to package the extension:

- Temporarily remove the `vscode` package from the root `package.json`
- `cd packages/html-fmt-vscode`
- `rm -rf node_modules && npm i`
- `vsce package`

To publish the extension:

- Create a Personal Access Token
  [here](https://dev.azure.com/nikolaosgeorgiou/_usersSettings/tokens). Select
  "All accessible organizations" and all "Marketplace" scopes.
- Login with `vsce login NikolaosGeorgiou`
- Publish with `vsce publish`

### Cleaning output files

With `git clean -fdx` you can delete `out` and `node_modules` folders.
