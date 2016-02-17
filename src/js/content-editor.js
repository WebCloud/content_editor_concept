import React, { Component, PropTypes } from 'react';

export default class ContentEditor extends Component {
  static propTypes = {
    children: PropTypes.node,
    previewHandler: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = { isPreviewing: false, previewContent: '' };
  }

  getInnerHTML() {
    const html = this.props.previewHandler();
    return {
      __html: html
    };
  }

  handleClick() {
    this.setState({ isPreviewing: !this.state.isPreviewing });
  }

  buildContent() {
    let defaultContent = this.props.children;

    if (this.state.isPreviewing) {
      defaultContent = (
        <div dangerouslySetInnerHTML={this.getInnerHTML()}></div>
      );
    }
    return defaultContent;
  }

  render() {
    return (
      <div>
        <button onClick={ this.handleClick }>Toggle Preview</button> <br />
        {this.buildContent()}
      </div>
    );
  }
}
