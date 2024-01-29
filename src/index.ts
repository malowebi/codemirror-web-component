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

import { LitElement, html } from 'lit';
import { Context } from './context';
import stylesheet from './styles';

class CodeMirror extends LitElement {
  private _context: Context;

  static formAssociated: Boolean = true;
  
  static styles = stylesheet;

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions, 
    delegatesFocus: true,
  };

   /**
   * List of the attributes monitored for change by the web component.
   */   
  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      'gutters',
      'tab-size',
      'language',
      'line-numbers',
      'highlight-active-line',
    ];
  }

  constructor() {
    super();
    this._context = new Context(this);
  }

  /**
   * Invoked when the web component is attached to the DOM.
   */  
  connectedCallback() {
    super.connectedCallback();
    this._context.init();
  }

  /**
   * Invoked when the web component is removed from the DOM.
   */
  disconnectedCallback() {
    this._context.destroy();
    super.disconnectedCallback();
  }

  /**
   * Invoked when one of the web component's `observedAttributes` 
   * has been updated. We update the codemirror's config accordingly.
   */  
  attributeChangedCallback(attr: string, oldVal: string | null, newVal: string | null) {
    if (oldVal !== newVal) {
      const ctx = this._context;

      ctx.ready.then(() => {
        switch (attr) {
          case 'gutters':
            ctx.reconfigureGutters(newVal !== null);
            break;
          case 'fold-gutter':
            ctx.reconfigureFoldGutter(newVal !== null);
            break;
          case 'line-numbers':
            ctx.reconfigureLineNumbers(newVal !== null);
            break;
          case 'language':
            ctx.reconfigureLanguage(newVal || '');
            break;
          case 'tab-size':
            ctx.reconfigureTabSize( parseInt(newVal as string, 10) );
            break;
          case 'highlight-active-line':
            ctx.reconfigureHighlightActiveLine(newVal !== null);
            break;
          default:
            break;
        }
      });
    }
  }
}

customElements.define('code-mirror', CodeMirror);

export default CodeMirror;
