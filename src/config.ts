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

const DEFAULT_GUTTERS               = false;
const DEFAULT_TAB_SIZE              = 4;
const DEFAULT_LANGUAGE              = 'html';
const DEFAULT_READONLY              = false;
const DEFAULT_FOLD_GUTTER           = false;
const DEFAULT_LINE_NUMBERS          = false;
const DEFAULT_HIGHLIGHT_ACTIVE_LINE = false;

enum ConfigKey {
  TabSize     = 'tabSize',
  Gutters     = 'gutters',
  Language    = 'language',
  FoldGutter  = 'foldGutter',
  LineNumbers = 'lineNumbers',
  ActiveLine  = 'highlightActiveLine',
};

interface ConfigProps {
  tabSize?: number;
  gutters?: Boolean;
  language?: string;
  readOnly?: Boolean;
  lineNumbers?: Boolean;
  foldGutter?: Boolean;
  highlightActiveLine?: Boolean;
};

class Config {
  declare tabSize: number;
  declare gutters: Boolean;
  declare language: string;
  declare readOnly: Boolean;
  declare lineNumbers: Boolean;
  declare foldGutter: Boolean;
  declare highlightActiveLine: Boolean;

  constructor(options: ConfigProps = {}) {
    const {
      tabSize, gutters, foldGutter,
      language, readOnly, lineNumbers, 
      highlightActiveLine 
    } = options;

    this.gutters = (typeof gutters === 'boolean') 
      ? gutters 
      : DEFAULT_GUTTERS;
    
    this.tabSize = (typeof tabSize === 'number')
      ? tabSize 
      : DEFAULT_TAB_SIZE;
    
    this.language = (typeof language === 'string') 
      ? language 
      : DEFAULT_LANGUAGE;
    
    this.readOnly = (typeof readOnly === 'boolean') 
      ? readOnly 
      : DEFAULT_READONLY;
    
    this.lineNumbers = (typeof lineNumbers === 'boolean') 
      ? lineNumbers 
      : DEFAULT_LINE_NUMBERS;
    
    this.foldGutter = (typeof foldGutter === 'boolean') 
      ? foldGutter 
      : DEFAULT_FOLD_GUTTER;
    
    this.highlightActiveLine = (typeof highlightActiveLine === 'boolean')
      ? highlightActiveLine 
      : DEFAULT_HIGHLIGHT_ACTIVE_LINE;
  }

  set(options: ConfigProps) {
    const {
      tabSize, gutters, foldGutter,
      language, readOnly, lineNumbers, 
      highlightActiveLine 
    } = options;

    (typeof tabSize === 'number') && (this.tabSize = tabSize);
    (typeof gutters === 'boolean') && (this.gutters = gutters);
    (typeof language === 'string') && (this.language = language);
    (typeof readOnly === 'boolean') && (this.readOnly = readOnly);
    (typeof foldGutter === 'boolean') && (this.foldGutter = foldGutter);
    (typeof lineNumbers === 'boolean') && (this.lineNumbers = lineNumbers);
    (typeof highlightActiveLine === 'boolean') && (this.highlightActiveLine = highlightActiveLine);
  }
}

export { Config, ConfigKey };
