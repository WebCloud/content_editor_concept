import React, { Component, PropTypes } from 'react';

const style = {
  padding: '1em',
  border: 'dashed 2px #acacac'
};

function clickEventHandler() {
  this.setState({ editMode: !this.state.editMode })
}

export default class TextPlugin extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.clickEventHandler = clickEventHandler.bind(this);
    this.state = { text: 'Here will be some text', editMode: false };
  }

  parseContent(classNames) {
    let parsedContent = (
      <h1 style={style} className={classNames} onClick={this.clickEventHandler}>
        { this.state.text }
      </h1>
    );

    if (this.state.editMode) {
      parsedContent = (
        <input type="text" placeholder="Here will be some text" />
      );
    }

    return parsedContent;
  }

  render() {
    const { className = '' } = this.props;
    const classNames = `text-plugin ${className}`;

    return (<div>
      {this.parseContent(classNames)}
    </div>);
  }
}
