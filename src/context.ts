/**
Copyright 2023 Jean-Noël Namory

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { minimalSetup } from "codemirror";
import { EditorView } from '@codemirror/view';
import { EditorState, Extension, StateEffect, Transaction } from '@codemirror/state';
import { css as cssLang } from '@codemirror/lang-css';
// import { javascript } from "@codemirror/legacy-modes/mode/javascript"
import { foldGutter, LanguageSupport/*, StreamLanguage*/ } from '@codemirror/language';
import { html as htmlLang } from '@codemirror/lang-html';
import { json as jsonLang } from '@codemirror/lang-json';
import { markdown as markdownLang } from '@codemirror/lang-markdown';
import { javascript as javascriptLang } from '@codemirror/lang-javascript';
import { gutters, highlightActiveLine, highlightActiveLineGutter, lineNumbers } from '@codemirror/view';

import { Deferred } from './deferred';
import { Config, ConfigKey } from './config';
import { Compartments } from './compartments';
import { parseNumberAttr, parseBooleanAttr, parseStringAttr } from './util';

class Context {
  value:        string;
  view:         EditorView | null;
  config:       Config;
  element:      HTMLElement;
  extensions:   Extension[];
  internals:    ElementInternals | null;
  domObserver:  MutationObserver;
  compartments: Compartments;
  ready:        Deferred<void>;

  constructor(element: HTMLElement) {
    this.value        = '';
    this.element      = element;
    this.internals    = element.attachInternals();
    this.view         = null;
    this.ready        = new Deferred;
    this.extensions   = [];
    this.compartments = new Compartments;
    this.config       = new Config;
    this.domObserver  = new MutationObserver((mutations: MutationRecord[]) => {
      const filter   = (m: MutationRecord) => (m.type === 'childList') && (m.target === element);
      for (const mutation of mutations.filter(filter)) {
        const [child] = mutation.addedNodes;
        if (mutation.type === 'childList' && (mutation.target === element) && child && (child.nodeType === Node.TEXT_NODE)) {
          this.initContent();
        }
      }
    });

    this.internals.role = 'textbox';
    this.internals.ariaLabel = 'Code editor';
  }

  init() {
    this.initConfig();
    this.initExtensions();
    this.initView();

    this.domObserver.observe(this.element, { childList: true });

    if (this.element.childNodes.length > 0) {
      this.initContent();
    }
  }

  destroy() {
    this.ready = new Deferred;
    this.config = new Config;
    this.extensions = []; 
    this.compartments = new Compartments;
    this.domObserver.disconnect();
  }

  initConfig() {
    const el = this.element as HTMLElement;
    const {
      config: { language, tabSize }
    } = this;

    this.config.set({
      gutters: el.hasAttribute('gutters'),
      readOnly: el.hasAttribute('read-only'),
      foldGutter: el.hasAttribute('fold-gutter'),
      lineNumbers: el.hasAttribute('line-numbers'),
      highlightActiveLine: el.hasAttribute('highlight-active-line'),
      language: parseStringAttr(el.getAttribute('language'), language),
      tabSize: el.hasAttribute('tab-size')
        ? parseNumberAttr(el.getAttribute('tab-size'), tabSize)
        : tabSize
    });
  }

  initExtensions() {
    const {
      config: cfg, extensions: ext, compartments
    } = this;

    const {
      language, gutters, valueChange,
      foldGutter, lineNumbers, tabSize,
      highlightActiveLine, 
    } = compartments;

    ext.push(minimalSetup);

    ext.push(
      gutters.of(cfg.gutters ? this.createGuttersExtension() : [])
    );

    ext.push(
      foldGutter.of(cfg.foldGutter ? this.createFoldGutterExtension() : [])
    );

    ext.push(
      lineNumbers.of(cfg.lineNumbers ? this.createLineNumbersExtension() : [])
    );

    ext.push(
      highlightActiveLine.of(cfg.highlightActiveLine ? this.createHighlightActiveLineExtension() : [])
    );

    ext.push(
      tabSize.of((cfg.tabSize) ? this.createTabSizeExtension(cfg.tabSize) : [])
    );

    ext.push(
      language.of(this.createLanguageExtension(cfg.language || 'html'))
    );

    ext.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const view = this.view as EditorView;
          this.internals?.setFormValue(view.state.doc.toString());
          this.element.dispatchEvent(
            new CustomEvent('change', { 
              bubbles: true, 
              composed: true,  
              detail: view.state.doc.toString()
            }),
          );          
        }
      })
    );     
  }

  initView() {
    this.view = new EditorView({
      parent: (this.element.shadowRoot as ShadowRoot), 
      state: EditorState.create({ doc: '', extensions: [...this.extensions] })
    });
  }

  initContent() {
    // this.setValue(this.element.shadowRoot?.host.textContent?.toString() || '');
    this.setValue(this.element.textContent?.toString() || '');
    this.ready.resolve();
  }

  setValue(value: string) {
    this.value = value;
    const view = this.view as EditorView;
    const data = {
      changes: { from: 0, insert: this.value }
    };
    view.dispatch( view.state.update(data) );
  }

  createTabSizeExtension(size: number) {
    return EditorState.tabSize.of(size);
  }

  createValueChangeExtension() {
    return gutters({ fixed: true });
  }

  createGuttersExtension() {
    return gutters({ fixed: true });
  }

  createFoldGutterExtension() {
    return foldGutter();
  }

  createLineNumbersExtension() {
    return lineNumbers();
  }

  createHighlightActiveLineExtension() {
    return [highlightActiveLine(), highlightActiveLineGutter()];
  }

  createLanguageExtension(language: string): LanguageSupport {
    switch (language) {
      case 'css':
        return cssLang();
      case 'html':
        return htmlLang();
      case 'json':
        return jsonLang();
      case 'markdown':
        return markdownLang();
      case 'js':
      case 'javascript':
        // return StreamLanguage.define(javascript);
        return javascriptLang();
      case 'ts':
      case 'typescript':
        return javascriptLang({ typescript: true });
      case 'jsx':
        return javascriptLang({ jsx: true });
      case 'tsx':
        return javascriptLang({ jsx: true, typescript: true });
      case 'html':
      default:
        return htmlLang();
    }
  }

  reconfigure(key: ConfigKey, data: string | number | Boolean) {
    switch (key) {
      case ConfigKey.Gutters: 
        return this.reconfigureGutters(data as Boolean);
      case ConfigKey.FoldGutter:
        return this.reconfigureFoldGutter(data as Boolean);
      case ConfigKey.Language:
        return this.reconfigureLanguage(data as string)
      case ConfigKey.TabSize:
        return this.reconfigureTabSize(data as number);
      case ConfigKey.ActiveLine:
        return this.reconfigureHighlightActiveLine(data as Boolean);
      case ConfigKey.LineNumbers:
        return this.reconfigureLineNumbers(data as Boolean);
    }
  }

  reconfigureGutters(enabled: Boolean) {
    this.view?.dispatch({
      effects: this.compartments.gutters.reconfigure(
        enabled ? this.createGuttersExtension() : []
      )
    });
  }

  reconfigureFoldGutter(enabled: Boolean) {
    this.view?.dispatch({
      effects: this.compartments.foldGutter.reconfigure(
        enabled ? this.createFoldGutterExtension() : []
      )
    });
  }

  reconfigureLineNumbers(enabled: Boolean) {
    this.view?.dispatch({
      effects: this.compartments.lineNumbers.reconfigure(
        enabled ? this.createLineNumbersExtension() : []
      )
    });
  }

  reconfigureTabSize(size: number) {
    this.view?.dispatch({
      effects: this.compartments.tabSize.reconfigure(
        size ? this.createTabSizeExtension(size) : []
      )
    });
  }

  reconfigureLanguage(languague: string) {
    this.view?.dispatch({
      effects: this.compartments.language.reconfigure(
        languague.length ? this.createLanguageExtension(languague) : []
      )
    });
  }

  reconfigureHighlightActiveLine(enabled: Boolean) {
    this.view?.dispatch({
      effects: this.compartments.highlightActiveLine.reconfigure(
        enabled ? this.createHighlightActiveLineExtension() : []
      )
    });
  }
}

export type { ConfigKey };
export { Compartments, Context, Config };
