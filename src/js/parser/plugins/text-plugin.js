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
  if (key === 'Enter') this.setState({ editMode: false, text });
}

export default class TextPlugin extends Component {
  static propTypes = {
    className: PropTypes.string,
    headingLevel: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.clickEventHandler = clickEventHandler.bind(this);
    this.handleInput = handleInput.bind(this);
    this.state = { text: 'Here will be some heading text', editMode: false };
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

  render() {
    const { className = '' } = this.props;
    const classNames = `text-plugin ${className}`;

    return (<div className={ classNames } style={ style }>
      {this.parseContent()}
    </div>);
  }
}
