import React, { Component, PropTypes } from 'react';
import MarkdownEditor from './md-plugin/markdown-editor';
import marked from 'marked';
import { autobind } from 'core-decorators';
import pluginConstructor from './plugin-constructor';

class MDPlugin extends Component {
  static propTypes = {
    pluginData: PropTypes.object,
    isPreviewing: PropTypes.bool,
    toggleEditMode: PropTypes.func,
    updatePluginData: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.string,
    editMode: PropTypes.bool
  };

  @autobind
  updateMarkdown(markdown) {
    const html = marked(markdown);
    const pluginData = { markdown, html };
    this.props.updatePluginData({ pluginData, editMode: false });
  }

  renderContent() {
    const { html = '', markdown = '' } = this.props.pluginData;
    const content = (!this.props.editMode)
      ? (
      <div onClick={this.props.toggleEditMode}>
        {(html !== '')
          ? <div dangerouslySetInnerHTML={{ __html: html }} />
          : 'Click to edit markdown'}
      </div>
      )
      : <MarkdownEditor
        markdown={markdown}
        onUpdateMarkdown={this.updateMarkdown}
      />;

    return content;
  }

  render() {
    const { className = '', style, width, editMode, pluginData: { markdown = '' } } = this.props;
    const classNames = `md-plugin ${className}`;
    const pluginStyle = Object.assign({}, style, {
      textAlign: (editMode || markdown !== '' ? 'left' : 'center'),
      width
    });

    return (<div className={ classNames } style={ pluginStyle }>
      {this.renderContent()}
    </div>);
  }
}

export default pluginConstructor(MDPlugin);
