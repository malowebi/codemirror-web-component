# Configuration

A CodeMirror editor's configuration lives in its `state` object. When creating   
a state, you pass it a set of extensions to use, which will be resolved into   
an effective configuration.

Extensions can be created by various library functions, and do things like   
adding an input for a facet or installing a state field. They can be grouped   
in arrays, and most practical extensions consist of multiple smaller ones.  

For example, the `history` extension contains a `state` field that records   
the undo history, a `facet` that controls the extension's configuration,   
and a `view plugin` that listens for `beforeinput` events. Code using the   
`history` doesn't have to worry about that though; it just drops the value    
produced by the function into its config to install all the necessary parts.

The `basic setup` is a larger example of this; it holds an array throwing   
together a whole cartload of different extensions, which together configure   
a basic code editor.

-------

## Precedence

With facet `inputs`, order matters. They are resolved in a specific order by   
the configuration, and for most facets, that order matters. For example with   
`event handlers`, `transaction filters`, or `keymaps`, it determines which   
gets called first. With settings such as either the `line separator` or the   
`indentation unit`, the value with the highest precedence wins.

When a configuration is resolved, by default, the tree of nested arrays of   
extensions are simply flattened into a sequence. Inputs to a given facet are   
then collected in the order they appear in that sequence.

So if you specify a configuration like this: `[keymap.of(A), keymap.of(B)]`,   
bindings from `A` take precedence over those from `B`. If you nest more deeply   
like this: `[..., [keymap.of(A)], ..., [[], ... [keymap.of(B)]]]`,   
`A` still comes before `B` via the flat ordering.

There is just one further complication, which allows extensions to provide a   
hint on where sub-extensions should go. When an extension is wrapped in a call   
to one of the properties of `Prec`, its parts are put in a different bucket   
from the default sequence during configuration flattening. There are `highest`,   
`high`, `default`, `low`, and `lowest` buckets.

Within buckets, ordering is still controlled by the position of the extensions   
in the flattened sequence. But all extensions in a higher-precedence bucket   
come before all extensions in a lower-precedence one.

So in an extension like this: `[Prec.high(A), B, Prec.high([C,D])]`, the sub   
extensions will be ordered such as `[A, C, D, B]`, because the ones with high   
precedence come before `B` with its default precedence.

In general, explicit precedence is used by extension providers to put parts   
of their extension in a specific bucket. For example, a special-purpose key   
binding that only applies in a specific situation might be given an extending     
precedence, so that it gets to run before the bulk of the keybindings. Or a   
default piece of configuration might be given a fallback precedence so that   
any other values provided will by default override it.

On the other hand, ordering of extensions in arrays is generally performed by   
the code building a complete configuration from various extension providers,   
and allows for a more global kind of control.

-------

## Dynamic Configuration

In this configuration system you can't just call a set-option method to change   
your configuration on the fly, because configuration does not have the shape    
that it has in, for example, CodeMirror 5: A map from option names to values.  

That is mostly a good thing; extensions will need to affect configuration,   
and doing that without stepping on each other's toes is difficult when each   
option has exactly one value, which is replaced with a new value when updated.   
`Facets` take multiple inputs and explicitly define some way to combine them,   
which mostly avoids such conflicts.

### Compartments

Still, dynamic reconfiguration is useful in an editor. In order to be able to   
partially reconfigure a subset of extensions, we need to divide it into what we     
call `compartments`. Transactions can update the configuration by replacing the   
content of individual compartments.

```javascript
import {basicSetup, EditorView} from "codemirror"
import {EditorState, Compartment} from "@codemirror/state"
import {html} from "@codemirror/lang-html"

const language = new Compartment;
const tabSize  = new Compartment;

const state = EditorState.create({
  extensions: [
    basicSetup,
    language.of(html()),
    tabSize.of(EditorState.tabSize.of(8))
  ]
})

let view = new EditorView({
  state,
  parent: document.body
});

function setTabSize(view, size) {
  view.dispatch({
    effects: tabSize.reconfigure(EditorState.tabSize.of(size))
  })
}


```
