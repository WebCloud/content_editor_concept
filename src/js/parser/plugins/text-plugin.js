import React, { Component, PropTypes } from 'react';

const style = {
  border: 'dashed 2px #acacac',
  padding: '0 1em',
  display: 'inline-block'
};

function clickEventHandler() {
  this.setState({ editMode: !this.state.editMode });
}

function getMarkdownHeading(headingLevel) {
  let markdownHeading = '';

  for (let i = 0; i < headingLevel; i++) {
    markdownHeading += '#';
  }

  return markdownHeading;
}

function handleInput({ key, target: { value: text } }) {
  if (key === 'Enter') {
    const headingLevel = this.props.headingLevel.match(/\d$/)[0];
    const markdownHeading = getMarkdownHeading(headingLevel);

    this.setState({ editMode: false, text, markdown: `${markdownHeading} ${text}` });
  }
}

export default class TextPlugin extends Component {
  static propTypes = {
    className: PropTypes.string,
    headingLevel: PropTypes.string,
    placeholderText: PropTypes.string,
    pluginIndex: PropTypes.number,
    getMarkdown: PropTypes.func,
    isPreviewing: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.clickEventHandler = clickEventHandler.bind(this);
    this.handleInput = handleInput.bind(this);

    const { placeholderText: text = 'Here will be some heading text' } = this.props;
    const headingLevel = this.props.headingLevel.match(/\d$/)[0];
    const markdown = `${getMarkdownHeading(headingLevel)} ${text}`;

    this.state = { text, editMode: false, markdown };
  }

  parseContent() {
    const props = { onClick: this.clickEventHandler };
    let parsedContent = React.createElement(this.props.headingLevel, props, this.state.text);

    if (this.state.editMode) {
      parsedContent = (
        <input type="text" placeholder={this.state.text} onKeyUp={this.handleInput} />
      );
    }

    return parsedContent;
  }

  shoudComponentUpdate(previousState, nextState) {
    return previousState.editMode !== nextState.editMode;
  }

  render() {
    const { className = '', pluginIndex, isPreviewing } = this.props;
    const { markdown } = this.state;
    const classNames = `text-plugin ${className}`;
    const pluginStyle = Object.assign({}, style, {
      border: ((isPreviewing) ? 'none' : style.border)
    });

    this.props.getMarkdown({ markdown, pluginIndex });

    return (<div className={ classNames } style={ pluginStyle }>
      {this.parseContent()}
    </div>);
  }
}
