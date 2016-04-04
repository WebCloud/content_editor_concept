import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';

const updatedClass = 'plugin--updated';
const dataSavedClass = 'plugin--data-saved';
const hasFileClass = 'plugin--has-file';

export default function PluginConstructor(Plugin) {
  return class extends Component {
    static propTypes = {
      className: PropTypes.string,
      setPluginData: PropTypes.func.isRequired,
      isPreviewing: PropTypes.bool.isRequired,
      pluginId: PropTypes.string.isRequired,
      pluginData: PropTypes.object.isRequired,
      isDataUpdated: PropTypes.bool.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        editMode: false,
        pluginData: Object.assign({ markdown: '' }, this.props.pluginData)
      };
    }

    @autobind
    toggleEditMode() {
      this.setState({ editMode: !this.state.editMode });
    }

    @autobind
    updatePluginData({ pluginData, editMode = this.state.editMode }) {
      this.setState({ pluginData, editMode });
    }

    componentDidUpdate() {
      const { file } = this.state.pluginData;

      if (this.props.isDataUpdated && this.state.pluginData.isPluginUpdated && file === null) {
        const pluginElement = findDOMNode(this);
        const callback = function transitionendEventHandler() {
          pluginElement.classList.remove(updatedClass);
          pluginElement.classList.add(dataSavedClass);

          pluginElement.removeEventListener('transitionend', callback);
        };

        pluginElement.classList.add(updatedClass);
        pluginElement.classList.remove(hasFileClass);
        pluginElement.addEventListener('transitionend', callback, false);
      }
    }

    render() {
      const style = {
        padding: '1em',
        border: 'dashed 2px #E6E5E5',
        display: 'inline-block'
      };
      const pluginStyle = Object.assign({}, style, {
        border: ((this.props.isPreviewing) ? 'none' : style.border)
      });
      const { pluginId } = this.props;
      const { pluginData } = this.state;
      const { file = null } = pluginData;
      const className = `plugin ${this.props.className} ${file !== null ? hasFileClass : ''}`;

      this.props.setPluginData({ pluginData, pluginId });
      return (<Plugin
        {...this.props}
        {...this.state}
        className={className}
        toggleEditMode={this.toggleEditMode}
        updatePluginData={this.updatePluginData}
        style={pluginStyle}
      />);
    }
  };
}
