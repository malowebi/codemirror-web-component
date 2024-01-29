# CodeMirror Web Component

> :warning: Not production ready

This project is meant to explore how far we can go by wrapping CodeMirror   
inside an encapsulated common, while still exposing a convenient API in   
order to interract with the componont.

Here is the list of features / improvements necessary to ship a `1.0.0` version :
- documentation
- internationalization
- unit tests (JSDOM seems to not support ShadowDOM so we need something else)
- accessibility tests
- event handling
- read-only mode
- lazy loading of extension: would help shrinking the size of the main bundle
- add support for themes

**Example:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body>
    <main>
      <code-mirror gutters fold-gutter line-numbers highlight-active-line language="markdown">
      # Web Components

      Lorem ipsum dolor sit amet

      ## 1. Introduction

      Lorem ipsum dolor sit amet

      ## 2. Custom Elements

      Lorem ipsum dolor sit amet

      ## 3. Shadow DOM

      Lorem ipsum dolor sit amet

      ## 4. Templates and Slots

      Lorem ipsum dolor sit amet
      </code-mirror>
    </main>
  </body>
</html>

```

