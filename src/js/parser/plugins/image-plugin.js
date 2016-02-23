import React, { Component, PropTypes } from 'react';
import { baseStyles, basePropTypes, baseStateVariables } from './base-plugin';

const style = Object.assign({}, baseStyles, { margin: '0em 1em 1em 0em' });
const pluginProptypes = Object.assign({
  width: PropTypes.string,
  height: PropTypes.string
}, basePropTypes);

export default class ImagePlugin extends Component {
  static propTypes = pluginProptypes;

  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.handleImageExtraction = this.handleImageExtraction.bind(this);

    this.state = {
      editMode: false,
      imageURL: 'http://i.imgur.com/wXpNi4T.gif'
    };
  }

  handleImageExtraction(event) {
    const { target } = event;
    event.preventDefault();
    event.stopPropagation();

    const inputs = target.parentElement.querySelectorAll('input');
    let element = null;

    inputs.forEach((input) => {
      if (input.value !== '' && input.value !== null) {
        element = input;
        return;
      }
    });

    if (element.type === 'file') {
      if (!element.name.match(/.jpg|.png|.gif/)) return;

      // send over the file
    } else {
      if (!element.value.match(/.jpg|.png|.gif/)) return;

      const imageURL = element.value;
      this.setState({ imageURL, editMode: false });
    }
  }

  dragOver({ preventDefault }) {
    // this is needed to avoid the default behaviour from the browser
    preventDefault();
  }

  dragEnter({ preventDefault }) {
    preventDefault();
    this.setState({ isDragging: true });
  }

  dragLeave({ preventDefault }) {
    preventDefault();
    this.setState({ isDragging: false });
  }

  drop({ preventDefault, dataTransfer: { files } }) {
    if (!this.state.isDisabled) {
      preventDefault();
      this.setState({ isDragging: false });

      // only 1 file for now
      const file = files[0];
      this.setState({ isDisabled: true });
      console.info(file);
    } else {
      console.error('you can only upload on file at the time');
    }
  }

  clickHandler() {
    this.setState({ editMode: true });
  }

  buildContent(isPreviewing) {
    const { imageURL } = this.state;
    const imageStyle = { display: 'block', width: this.props.width };
    const imageElement = <img src={imageURL} style={ imageStyle } />;

    let defaultContent = (
      <div>
        Here will be an image like bellow
        { imageElement }
      </div>
    );

    if (this.state.editMode) {
      const editorStyle = {
        display: 'flex',
        flexDirection: 'column'
      };

      defaultContent = (
        <div style={ editorStyle } className="image-editor-wrapper">
          <input type="text" placeholder="http://image.url" />
          <br />
          <span>or</span>
          <br />
          <input type="file" />
          <br />
          <button onClick={this.handleImageExtraction}>Done</button>
        </div>
      );
    }

    if (isPreviewing) {
      defaultContent = imageElement;
    }

    return defaultContent;
  }

  render() {
    const {
      className = '',
      getMarkdown,
      pluginIndex,
      isPreviewing
    } = this.props;
    const classNames = `image-plugin ${className}`;
    const markdown = `![](${this.state.imageURL})`;
    const pluginStyle = Object.assign({}, style, {
      border: ((isPreviewing) ? 'none' : style.border)
    });

    getMarkdown({ markdown, pluginIndex });

    return (
      <div style={pluginStyle} className={classNames} onClick={this.clickHandler}>
        {this.buildContent(isPreviewing)}
      </div>
    );
  }
}
