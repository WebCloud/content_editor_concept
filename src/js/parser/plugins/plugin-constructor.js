import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';

export default function PluginConstructor(Plugin) {
  return class extends Component {
    static propTypes = {
      className: PropTypes.string,
      pluginIndex: PropTypes.number,
      setPluginData: PropTypes.func,
      isPreviewing: PropTypes.bool,
      pluginId: PropTypes.string
    };

    constructor(props) {
      super(props);

      this.state = {
        editMode: false,
        pluginData: { markdown: '' }
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

    render() {
      const style = {
        padding: '1em',
        border: 'dashed 2px #E6E5E5',
        display: 'inline-block'
      };

      const pluginStyle = Object.assign({}, style, {
        border: ((this.props.isPreviewing) ? 'none' : style.border)
      });

      const { pluginIndex, pluginId } = this.props;
      const { pluginData } = this.state;

      const className = `plugin ${this.props.className}`;

      this.props.setPluginData({ pluginData, pluginIndex, pluginId });
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
