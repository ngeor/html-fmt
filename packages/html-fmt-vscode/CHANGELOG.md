# Change Log

All notable changes to the "html-fmt-vscode" extension will be documented in
this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how
to structure this file.

## [Unreleased]

## [0.6.0]

- Support for trimming whitespace modifier (e.g. `<~TMPL_V foo ~>`)
- Support `TMPL_INLINE` with extra arguments
- Do not add quotes on TMPL_V attributes if missing
- Better support for `attr=[% value %]` expressions

## [0.5.2]

- Configurable option for the quotes of attribute values.
- Changed the default value for the trailing slash of void elements to `remove`.

## [0.4.0]

- Configurable option for the trailing slash of
  [void elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)

## [0.3.0]

- Support indentation size as a setting in VS Code Extension
- Multiline attribute threshold
- Support for tags: hr, style, \_TMPL_INCLUDE, TMPL_INCLUDE, TMPL_LOOP,
  TMPL_STATIC_URL, TMPL_URI, TMPL_VAR
- Support for tags with mixed normal attributes and perl expressions
- Improved DOCTYPE support
- Support for dollar sign expressions like `<TMPL_VAR $error_msg>`

## [0.2.0]

- Processing directories to see if parser can parse contents
- Support for `TMPL_IF` expressions inside attribute values
- Support html doctype declaration
- Keep `TMPL_WS` on the same line with the next and previous tag
- Leave script contents unformatted
- Support self-closing elements
- Do not break one-liner like `<p>hello</p>` into multiple lines
- Do not add spaces inside `textarea`
- Showing errors in Visual Studio Code

## [0.1.1] Support for BR tags

- Support for BR tags

## [0.1.0] Initial release

- Initial release
