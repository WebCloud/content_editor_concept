import React, { Component, PropTypes } from 'react';

export default class ContentEditor extends Component {
  static propTypes = {
    children: PropTypes.node,
    previewHandler: PropTypes.func
  };

  render() {
    return (
      <div>
        <button onClick={ this.props.previewHandler }>Preview</button> <br />
        {this.props.children}
      </div>
    );
  }
}
