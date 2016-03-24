import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import pluginConstructor from './plugin-constructor';

const flexBox = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center'
};
const style = Object.assign({}, flexBox, {
  margin: '0 0 1em',
  position: 'relative',
  padding: '1em',
  boxSizing: 'content-box'
});

@autobind
class ImagePlugin extends Component {
  static propTypes = {
    pluginData: PropTypes.object,
    isPreviewing: PropTypes.bool,
    updatePluginData: PropTypes.func,
    toggleEditMode: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    editMode: PropTypes.bool
  };

  setImageFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = ({ target: { result: imageURL } }) => {
      function markdown({ pluginData: { imageURL: image, alt: imgAlt }, className }) {
        return `<img alt="${imgAlt}" class="${className}" src="${image}" />`;
      }

      const { name: alt } = file;
      const pluginData = Object.assign({}, this.props.pluginData, {
        imageURL,
        key: 'imageURL',
        file,
        alt,
        markdown,
        isDragging: false
      });
      this.props.updatePluginData({ pluginData, editMode: false });
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

    if (element === null) {
      this.props.toggleEditMode();
      return;
    }

    if (element.type === 'file') {
      const file = element.files[0];

      if (!file.name.match(/.jpg|.png|.gif/)) return;

      this.setImageFile(file);
    } else {
      if (!element.value.match(/.jpg|.png|.gif/)) return;

      const { alt, imageURL } = this.props.pluginData;
      const markdown = `![${alt}](${imageURL})`;

      const pluginData = Object.assign({}, this.props.pluginData, {
        imageURL: element.value,
        markdown
      });

      this.props.updatePluginData({ pluginData, editMode: false });
    }
  }

  dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  dragEnter(event) {
    event.preventDefault();
    const pluginData = Object.assign({}, this.props.pluginData, { isDragging: true });
    this.props.updatePluginData({ pluginData });
  }

  dragLeave(event) {
    event.preventDefault();
    const pluginData = Object.assign({}, this.props.pluginData, { isDragging: false });
    this.props.updatePluginData({ pluginData });
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
    this.props.toggleEditMode();
  }

  bindDragAndDropEvents() {
    return {
      onDragEnter: this.dragEnter,
      onDragOver: this.dragOver,
      onDragLeave: this.dragLeave,
      onDrop: this.drop
    };
  }

  renderContent() {
    const { pluginData: { imageURL }, isPreviewing, width } = this.props;
    const imageStyle = {
      display: 'block',
      width: '100%',
      maxWidth: width,
      maxHeight: '100%',
      opacity: (isPreviewing ? 1 : '0.6'),
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 'auto',
      zIndex: -1
    };
    const imageElement = <img src={imageURL} style={ imageStyle } />;
    const { padding } = style;

    let defaultContent = (
      <div style={flexBox}>
        <div style={{ background: '#F9F9F9', padding: '0.3em', textAlign: 'center' }}>
          Drop and image here or click for more options
        </div>
        { (imageURL !== '' ? imageElement : null) }
      </div>
    );

    if (this.props.editMode) {
      const editorStyle = {
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        padding,
        width: '10em',
        textAlign: 'center'
      };

      defaultContent = (
        <div style={flexBox}>
          <div style={editorStyle} className="image-editor-wrapper">
            <input type="text" placeholder="http://image.url" />
            <br />
            <span>or</span>
            <br />
            <input type="file" />
            <br />
            <button onClick={this.handleImageExtraction}>Done</button>
          </div>
          { (imageURL !== '' ? imageElement : null) }
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
      pluginData,
      isPreviewing,
      editMode,
      width,
      height = '10em'
    } = this.props;
    const { isDragging } = pluginData;

    const classNames = `image-plugin ${className}`;

    let { border } = this.props.style;
    if (isPreviewing) {
      border = 'none';
    }
    if (isDragging) {
      border = '2px dashed #A0E2C4';
    }

    const background = typeof pluginData.imageURL !== 'undefined'
      ? 'transparent'
      : 'url(/img/image_placeholder.svg) no-repeat center';

    let editModeStyle = (!editMode) ? null : {
      width: null,
      minWidth: width
    };

    let componentWidth = `calc(${width} - (1em * 2))`;

    if (width.match(/\%/) !== null) {
      componentWidth = width;
      editModeStyle = null;
    }

    const pluginStyle = Object.assign({}, this.props.style, style, {
      border,
      background,
      backgroundSize: 'auto 50%',
      width: componentWidth,
      height
    }, editModeStyle);

    const events = this.bindDragAndDropEvents();

    const overlayEvents = Object.assign({}, events, {
      onDragEnter: (event) => {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    const dragOverlayStyle = {
      position: 'absolute',
      display: ((isDragging) ? 'flex' : 'none'),
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      background: 'rgba(246, 251, 248, 0.9)',
      color: '#636363',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const dragOverlay = <div style={dragOverlayStyle} {...overlayEvents}>Drop here...</div>;

    return (
      <div
        style={pluginStyle}
        onClick={this.clickHandler}
        onDragEnter={events.onDragEnter}
        className={classNames}
      >
        {this.renderContent()}
        { dragOverlay }
      </div>
    );
  }
}

export default pluginConstructor(ImagePlugin);
