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

import { Compartment } from '@codemirror/state';

class Compartments {
  tabSize: Compartment;
  gutters: Compartment;
  language: Compartment;
  readOnly: Compartment;
  foldGutter: Compartment;
  lineNumbers: Compartment;
  highlightActiveLine: Compartment;

  constructor() {
    this.tabSize = new Compartment();
    this.gutters = new Compartment();
    this.readOnly = new Compartment();
    this.language = new Compartment();
    this.foldGutter = new Compartment();
    this.lineNumbers = new Compartment();
    this.highlightActiveLine = new Compartment();
  }
};

export { Compartments };
