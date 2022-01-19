# Change Log

All notable changes to the "html-fmt-vscode" extension will be documented in
this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how
to structure this file.

## [Unreleased]

# [0.8.0]

- Added: new setting `extraNonIndentingTags` to allow indentation of certain tags
  to remain unchanged. As an example, adding `html` to the list of these tags will
  cause the tags `head` and `body` to be on the same indentation level as the
  parent `html` tag.

# [0.7.0]

- Added: Support for Angular square bracket attributes (thanks to [ringtail003](https://github.com/ringtail003)!)
- Fix: Support for perl expressions inside tags inside attribute values
- Fix: Adding quotes for `value` attribute in `<input value="<TMPL_V something>">`

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
