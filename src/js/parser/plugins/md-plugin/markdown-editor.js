import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import { autobind } from 'core-decorators';

@autobind
export default class MarkdownEditor extends Component {
  static propTypes = {
    markdown: PropTypes.string,
    onUpdateMarkdown: PropTypes.func.isRequired
  };

  componentDidMount() {
    const element = this.findTextarea();
    this.editor = new SimpleMDE({
      element,
      autofocus: true,
      spellChecker: false,
      previewRender: (plainText) => marked(plainText),
      initialValue: '',
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'table',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide'
      ],
      status: [
        'autosave', 'lines', 'words', 'cursor',
        this.createCloseButton()
      ]
    });
  }

  onKeyDown({ metaKey, key }) {
    if (metaKey && key === 'Enter') {
      this.onDoneWithEditing();
    }
  }

  onDoneWithEditing() {
    this.props.onUpdateMarkdown(this.editor.value()); // this will already close the editor
  }

  createCloseButton() {
    return {
      className: 'close-editor pull-left',
      defaultValue: (el) => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Close editor';
        button.addEventListener('click', this.onDoneWithEditing);
        el.setAttribute('style', 'margin: 0');
        el.appendChild(button);
      }
    };
  }

  findTextarea() {
    const el = findDOMNode(this);
    const textareas = el.getElementsByTagName('textarea') || [];
    if (!textareas[0]) throw new Error('Must have textarea child');
    return textareas[0];
  }

  render() {
    const { markdown = '' } = this.props;
    return (
      <div onKeyDown={this.onKeyDown}>
        <textarea className="form-control asset-type-markdown"
          value={markdown} readOnly
        />
      </div>
    );
  }
}
