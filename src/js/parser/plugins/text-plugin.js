import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';
import pluginConstructor from './plugin-constructor';

let componentWidth = null;

class TextPlugin extends Component {
  static propTypes = {
    headingLevel: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    toggleEditMode: PropTypes.func,
    updatePluginData: PropTypes.func,
    pluginData: PropTypes.object,
    editMode: PropTypes.bool
  };

  componentWillUpdate() {
    const header = findDOMNode(this).querySelector(this.props.headingLevel);
    if (header !== null) {
      componentWidth = header.getBoundingClientRect().width;
    }
  }

  componentDidUpdate() {
    const { input } = this.refs;
    if (typeof input === 'undefined') return;

    findDOMNode(input).focus();
  }

  getMarkdownHeading(headingLevel) {
    let markdownHeading = '';
    let i = 0;

    for (i; i < headingLevel; i++) {
      markdownHeading += '#';
    }

    return markdownHeading;
  }

  @autobind
  handleInput({ key, target: { value: text } }) {
    if (key === 'Enter') {
      const { text: pluginText } = this.props.pluginData;

      if (text === pluginText || text === '') {
        this.props.toggleEditMode();
        return;
      }

      const headingLevel = this.props.headingLevel.match(/\d$/)[0];
      const markdownHeading = this.getMarkdownHeading(headingLevel);
      const pluginData = { text, markdown: `${markdownHeading} ${text}` };

      this.props.updatePluginData({ editMode: false, pluginData });
    }

    if (key === 'Escape') {
      this.props.toggleEditMode();
    }
  }

  renderContent() {
    const {
      pluginData: { text = 'Here will be some heading text' },
      toggleEditMode: onClick,
      editMode,
      headingLevel
    } = this.props;
    let parsedContent = null;

    if (editMode) {
      parsedContent = (
        <input type="text"
          placeholder={text}
          ref="input"
          onKeyUp={this.handleInput}
          style={{
            padding: '1em 0 0',
            marginBottom: '1em',
            outline: 'none',
            border: 'none',
            borderBottom: '2px solid #E4E4E4',
            fontSize: '1em',
            width: componentWidth
          }}
        />
      );
    } else {
      parsedContent = React.createElement(headingLevel, { onClick }, text);
    }

    return parsedContent;
  }

  render() {
    const { className = '', style } = this.props;
    const classNames = `text-plugin ${className}`;
    const borderStyle = { border: (this.props.editMode ? 'dashed 2px #F1F1F1' : style.border) };
    const pluginStyle = Object.assign({}, style, {
      margin: '0 1em',
      padding: '0 1em'
    }, borderStyle);

    return (<div className={ classNames } style={ pluginStyle }>
      {this.renderContent()}
    </div>);
  }
}

export default pluginConstructor(TextPlugin);
