import React, { Component, PropTypes } from 'react';
import { baseStyles, basePropTypes, baseStateVariables } from './base-plugin';
import { autobind } from 'core-decorators';

const style = Object.assign({}, baseStyles, { margin: '0em 1em 1em 0em' });
const pluginProptypes = Object.assign({
  width: PropTypes.string,
  height: PropTypes.string
}, basePropTypes);

@autobind
export default class ImagePlugin extends Component {
  static propTypes = pluginProptypes;

  constructor(props) {
    super(props);

    const pluginData = {
      imageURL: 'http://i.imgur.com/wXpNi4T.gif',
      alt: 'sample image',
      key: 'imageURL'
    };

    this.state = Object.assign({}, baseStateVariables, {
      pluginData,
      isDragging: false
    });
  }

  setImageFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = ({ target: { result } }) => {
      const imageURL = result;
      const alt = file.name;
      const pluginData = Object.assign({}, this.state.pluginData, { imageURL, file, alt });
      this.setState({ pluginData, editMode: false, isDragging: false });
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
      const file = element.files[0];

      if (!file.name.match(/.jpg|.png|.gif/)) return;

      this.setImageFile(file);
    } else {
      if (!element.value.match(/.jpg|.png|.gif/)) return;

      const pluginData = Object.assign({}, this.state.pluginData, { imageURL: element.value });

      this.setState({ pluginData, editMode: false });
    }
  }

  dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dragEnter(event) {
    event.preventDefault();
    this.setState({ isDragging: true });
  }

  dragLeave(event) {
    event.preventDefault();
    this.setState({ isDragging: false });
  }

  drop(event) {
    event.preventDefault();
    event.stopPropagation();
    const { dataTransfer: { files } } = event;

    // only 1 file for now
    const file = files[0];
    this.setImageFile(file);
  }

  clickHandler({ target: { tagName } }) {
    if (tagName.toLowerCase().match(/button|input/) !== null) return;

    this.setState({ editMode: true });
  }

  bindDragAndDropEvents() {
    return {
      onDragEnter: this.dragEnter,
      onDragOver: this.dragOver,
      onDragLeave: this.dragLeave,
      onDrop: this.drop
    };
  }

  buildContent(isPreviewing) {
    const { pluginData: { imageURL } } = this.state;
    const imageStyle = { display: 'block', width: this.props.width };
    const imageElement = <img src={imageURL} style={ imageStyle } />;

    const events = this.bindDragAndDropEvents();

    const overlayEvents = Object.assign({}, events, {
      onDragEnter: (event) => {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    const { padding } = style;
    const defaultStyle = { padding, position: 'relative' };
    const dragOverlayStyle = {
      position: 'absolute',
      display: ((this.state.isDragging) ? 'flex' : 'none'),
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      background: 'rgba(228, 228, 228, 0.82)',
      color: '#636363',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const dragOverlay = <div style={dragOverlayStyle} {...overlayEvents}>Drop here...</div>;

    let defaultContent = (
      <div onClick={this.clickHandler} onDragEnter={events.onDragEnter} style={defaultStyle}>
        Here will be an image like bellow
        { imageElement }
        { dragOverlay }
      </div>
    );

    if (this.state.editMode) {
      const editorStyle = {
        display: 'flex',
        flexDirection: 'column',
        padding
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
      getData,
      pluginIndex,
      isPreviewing,
      pluginId
    } = this.props;
    const { pluginData, isDragging } = this.state;
    const classNames = `image-plugin ${className}`;
    const markdown = function getMarkdown({ imageURL, alt }) {
      return `![${alt}](${imageURL})`;
    };

    let border = style.border;

    if (isPreviewing) {
      border = 'none';
    }
    if (isDragging) {
      border = '2px dashed #A0E2C4';
    }

    const pluginStyle = Object.assign({}, style, { border, padding: 'none' });
    getData({ markdown, pluginIndex, pluginData, pluginId });

    return (
      <div style={pluginStyle} className={classNames}>
        {this.buildContent(isPreviewing)}
      </div>
    );
  }
}
