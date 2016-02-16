import React, { Component, PropTypes } from 'react';

const style = {
  border: 'dashed 2px #acacac',
  padding: '0 1em',
  display: 'inline-block'
};

function clickEventHandler() {
  this.setState({ editMode: !this.state.editMode });
}

function handleInput({ key, target: { value: text } }) {
  if (key === 'Enter') {
    const headingLevel = this.props.headingLevel.match(/\d$/)[0];
    let markdownHeading = '';
    for (let i = 0; i < headingLevel; i++) {
      markdownHeading += '#';
    }
    this.props.getMarkdown(`${markdownHeading} ${text}`, this.props.pluginIndex);
    this.setState({ editMode: false, text, markdown: `${markdownHeading} ${text}` });
  }
}

export default class TextPlugin extends Component {
  static propTypes = {
    className: PropTypes.string,
    headingLevel: PropTypes.string,
    placeholderText: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.clickEventHandler = clickEventHandler.bind(this);
    this.handleInput = handleInput.bind(this);
    const { placeholderText: text } = this.props;
    this.state = { text: text || 'Here will be some heading text', editMode: false };
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
    const { className = '' } = this.props;
    const classNames = `text-plugin ${className}`;

    return (<div className={ classNames } style={ style }>
      {this.parseContent()}
    </div>);
  }
}
