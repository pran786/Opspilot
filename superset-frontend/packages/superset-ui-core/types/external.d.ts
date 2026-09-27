/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

declare module 'markdown-to-jsx' {
  import type { ComponentType, ReactNode } from 'react';

  export interface MarkdownProps {
    children?: ReactNode;
    options?: Record<string, any>;
    [key: string]: any;
  }

  const Markdown: ComponentType<MarkdownProps>;
  export default Markdown;
}

declare module 'react-ace' {
  import type { Component } from 'react';

  export interface IAceEditorProps {
    name?: string;
    style?: React.CSSProperties;
    mode?: string;
    theme?: string;
    height?: string;
    width?: string;
    fontSize?: number | string;
    showGutter?: boolean;
    showPrintMargin?: boolean;
    highlightActiveLine?: boolean;
    focus?: boolean;
    cursorStart?: number;
    wrapEnabled?: boolean;
    readOnly?: boolean;
    minLines?: number;
    maxLines?: number;
    enableBasicAutocompletion?: boolean | string[];
    enableLiveAutocompletion?: boolean | string[];
    tabSize?: number;
    value?: string;
    defaultValue?: string;
    scrollMargin?: number[];
    onLoad?: (editor: any) => void;
    onBeforeLoad?: (ace: any) => void;
    onChange?: (value: string, event?: any) => void;
    onCopy?: (value: string) => void;
    onPaste?: (value: string) => void;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    onScroll?: (editor: any) => void;
    editorProps?: Record<string, any>;
    setOptions?: Record<string, any>;
    keyboardHandler?: string;
    commands?: any[];
    annotations?: any[];
    markers?: any[];
    className?: string;
    [key: string]: any;
  }

  export default class AceEditor extends Component<IAceEditorProps> {
    editor: {
      container: HTMLElement;
      [key: string]: any;
    };
  }
}
