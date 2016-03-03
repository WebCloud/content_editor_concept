import React, { Component, PropTypes } from 'react';
import { Parser } from './parser';

export default class ContentEditor extends Component {
  static propTypes = {
    template: PropTypes.string,
    componentsStyle: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.compileTemplate = this.compileTemplate.bind(this);
    this.state = { isPreviewing: false };
  }

  handleClick() {
    const isPreviewing = !this.state.isPreviewing;
    this.setState({ isPreviewing });
  }

  compileTemplate() {
    const { template } = this.props;
    console.info(Parser.compileTemplate({ template }));
  }

  render() {
    const { template, componentsStyle: style } = this.props;
    const { isPreviewing } = this.state;

    const editorElements = Parser.getChildrenNodes({
      template: template.replace(/\n|(\s{1,}(?=<))/g, ''),
      style,
      isPreviewing
    });

    return (
      <div>
        <button onClick={ this.handleClick }>Toggle Preview</button>
        <button onClick={ this.compileTemplate }>Preview result</button> <br />
        { editorElements }
      </div>
    );
  }
}
