import React from 'react';
import marked from 'marked';

// RegEx for the plugin syntax: {content.pluginName {pluginProp: 'propValue'}}
const pluginRegEx = /\{content\.\w+(\s\{(\w+:\s?('|")?\w+((-|_|\s)\w+){0,}%?('|")?(,)?\s?){1,}\})?\}/g; // eslint-disable-line max-len
// RegEx for the plugin props part on the plugin syntax, using JSON-like values
const propsRegEX = /\{(\w+:\s?('|")?\w+((-|_|\s)\w+){0,}%?('|")?(,)?\s?){1,}\}/g;

// Object to be used as the this keyworkd on each new instance for the mapPluginMarkdown
// function, in order to get the markdown content out of the Parser plugins
const pluginDataMap = [];

const Parser = {
  getChildrenNodes({ template, style, isPreviewing }) {
    // Transform the template into a DOM tree in order to better transverse it
    // and transform it into React elements to be rendered into the screen

    const node = document.createElement('div');
    node.innerHTML = template;
    const nodeId = '0';

    // Call parseNodes in order to transform the childNodes into React Elements
    // or into Parser plugin instances. Return the parsed nodes to be rendered.
    return this.parseNodes({ node, style, isPreviewing, nodeId });
  },

  parseNodes({ node: { childNodes = [] }, style, isPreviewing, nodeId }) {
    let nodeList = [];

    childNodes.forEach((node, index) => {
      const childNodeId = `${nodeId}-${index}`;
      // Ff the node has no tagName it indicates that it is a text, it could be
      // just a text or a snippet for the plugin syntax e.g: {content.image ...}
      if (typeof node.tagName === 'undefined') {
        // Call extractPlugins to check for snippets for the plugin syntax.
        // Receive in return an array of node lists to be concatenated into our
        // current node list.
        const textContent = node.textContent;
        nodeList = nodeList.concat(
          this.extractPlugins({ textContent, isPreviewing, nodeId: childNodeId })
        );
      } else {
        const { tagName, className } = node;
        const key = `${childNodeId}-${tagName}`;
        let childrenList = null;

        // If we have childNodes call parseNodes on the node to keep trasversing
        // and parsing the tree. Receive the result into a array, childrenList
        if (node.hasChildNodes()) {
          childrenList = this.parseNodes({ node, isPreviewing, nodeId: childNodeId });
        }

        // If we have style defined to be used, create a style tag for inline
        // styling the component
        if (typeof style !== 'undefined') {
          nodeList.push(React.createElement('style', { key: `${childNodeId}-style` }, style));
        }

        nodeList.push(React.createElement(tagName.toLowerCase(), { className, key }, childrenList));
      }
    });

    return nodeList;
  },

  extractPlugins({ textContent, isPreviewing, nodeId }) {
    // Receive any matches for the plugin syntax
    const editableParts = textContent.match(pluginRegEx);
    let matches = [];

    if (editableParts !== null) {
      // If we find plugin matches map them into React Elements on a two part step
      matches = editableParts.map((entry, index) => {
        const pluginName = entry.replace(/(\{)|(content\.)|(\})/g, '').split(' ')[0];
        const pluginId = `${nodeId}-${pluginName}-${index}`;
        const pluginIndex = pluginDataMap.findIndex(({ pluginId: id }) => id === pluginId);
        let props = {};

        if (pluginIndex !== -1) {
          // If the plugin already exists in the pluginDataMap, we fetch it's props
          props = pluginDataMap[pluginIndex];
        } else {
          // Check for the presence of props passed to the plugin syntax
          const unparsedProps = entry.match(propsRegEX);

          if (unparsedProps !== null) {
            // If we have props, normalize it into a JSON string to then parse it into
            // a JSON object.
            const normalizedPropsString = unparsedProps[0]
              .replace(/\w+:/g, (match) => (`"${match.split(':')[0]}":`))
              .replace(/'/g, '"');

            props = JSON.parse(normalizedPropsString);
          }

          pluginDataMap.push({ pluginId, ...props });
        }

        // Require the React component and create a new React element with it
        return React.createElement(
          require(`./plugins/${pluginName}-plugin`).default,
          // Create a new object combining the declared plugin props on the template with
          // other needed props such as the key, the pluginId and the setPluginData
          Object.assign({
            key: pluginId,
            pluginId,
            // Pass the mapPluginMarkdown to index the markdown content
            setPluginData: this.mapPluginData,
            isPreviewing
          }, props)
        );
      });
    } else {
      // If no plugin syntax is found, simply return the text
      matches = [textContent];
    }

    return matches;
  },

  // Function to be used as a model for the setPluginData prop for each Parser plugin instance
  // into the ContentEditor
  mapPluginData({ pluginData, pluginId }) {
    const pluginIndex = pluginDataMap.findIndex(({ pluginId: id }) => id === pluginId);

    // Create a new props object, which will be all current props + an updated pluginData
    const props = Object.assign({},
      pluginDataMap[pluginIndex],
      { pluginData }
    );

    // Update the plugin props with the new props object
    pluginDataMap[pluginIndex] = props;
  },

  // A simple getter for the private variable pluginDataMap
  getPluginData() {
    return pluginDataMap;
  },

  // Run though the pluginDataMap matching the pluginId. Once found update the plugin data
  // with the passed value.
  updatePluginData({ pluginId: targetId, value }) {
    pluginDataMap.forEach((plugin, index) => {
      const { pluginId, pluginData } = plugin;
      let isTarget = false;
      let pluginValueIndex = null;

      // The targetId can be either an object or array, deppending on the number of plugins
      // that sent data to be saved
      if (typeof targetId.includes !== 'undefined') {
        isTarget = targetId.includes(pluginId);
        pluginValueIndex = targetId.indexOf(pluginId);
      } else {
        isTarget = pluginId === targetId;
      }

      if (isTarget) {
        // Update the desired entry on the pluginData, indicated by the pluginData.key property
        // The value property can be either an array or object, depending on the number of plugins
        // that sent data to be saved
        const newValue = (pluginValueIndex !== null) ? value[pluginValueIndex] : value;
        pluginData[pluginData.key] = newValue;
        // Remove the file from memory after updating the plugin data
        pluginData.file = null;
        pluginDataMap[index].pluginData = pluginData;
      }
    });
  },

  // Compiles the template by matching the plugin matches with the pluginRegEx and
  // parsing their Markdown content with marked
  compileTemplate({ template }) {
    let pluginIndex = 0;

    return template.replace(pluginRegEx, () => {
      const { markdown = '' } = pluginDataMap[pluginIndex].pluginData;
      const pluginMarkdown = (typeof markdown === 'function'
        ? markdown(pluginDataMap[pluginIndex])
        : markdown
      );
      pluginIndex++;

      return marked(pluginMarkdown);
    });
  }
};

export {
  Parser
};
