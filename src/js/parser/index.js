import React from 'react';
import marked from 'marked';

// RegEx for the plugin syntax: {content.pluginName {pluginProp: 'propValue'}}
const pluginRegEx = /\{content\.\w+(\s\{(\w+:\s?('|")?\w+((-|_|\s)\w+){0,}('|")?(,)?\s?){1,}\})?\}/g; // eslint-disable-line max-len
// RegEx for the plugin props part on the plugin syntax, using JSON-like values
const propsRegEX = /\{(\w+:\s?('|")?\w+((-|_|\s)\w+){0,}('|")?(,)?\s?){1,}\}/g;

// Object to be used as the this keyworkd on each new instance for the mapPluginMarkdown
// function, in order to get the markdown content out of the Parser plugins
let pluginDataMap = [];

const Parser = {
  getChildrenNodes({ template, style, isPreviewing }) {
    // Transform the template into a DOM tree in order to better transverse it
    // and transform it into React elements to be rendered into the screen

    const node = document.createElement('div');
    node.innerHTML = template;
    const nodeId = '0';
    pluginDataMap = [];

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
      matches = editableParts.map((entry) => {
        // Add a new empty string to represent a default markdown string for each plugin
        // instance
        pluginDataMap.push('');
        const pluginIndex = pluginDataMap.length - 1;

        // Check for the presence of props passed to the plugin syntax
        const unparsedProps = entry.match(propsRegEX);
        let props = {};

        if (unparsedProps !== null) {
          // If we receive, normalize it into a JSON string to then parse it into
          // a JSON object.
          props = JSON.parse(
                    unparsedProps[0].replace(/\w+:/g, (match) => (`"${match.split(':')[0]}":`))
                                    .replace(/'/g, '"'));
        }

        // Return an object with the pluginName and the props to be used to
        // require the React component
        return {
          pluginName: entry.replace(/(\{)|(content\.)|(\})/g, '').split(' ')[0],
          props,
          pluginIndex
        };
      }).map(({ pluginName, props, pluginIndex }, index) => (
        // Require the React component and create a new React element with it
        React.createElement(
          require(`./plugins/${pluginName}-plugin`).default,
          Object.assign({
            key: `${nodeId}-${pluginName}-${index}`,
            pluginIndex,
            // Pass the mapPluginMarkdown to index the markdown content
            getData: this.mapPluginData,
            isPreviewing
          }, props)
        )
      ));
    } else {
      // If no plugin syntax is found, simply return the text
      matches = [textContent];
    }

    return matches;
  },

  // Function to be used as a model for the getData prop for each Parser plugin instance
  // into the ContentEditor
  mapPluginData({ markdown, pluginIndex, pluginData }) {
    pluginDataMap[pluginIndex] = { markdown, pluginData };
  },

  // Compiles the template by matching the plugin matches with the pluginRegEx and
  // parsing their Markdown content with marked
  compileTemplate({ template }) {
    let pluginIndex = 0;

    return template.replace(pluginRegEx, () => {
      const replacement = pluginDataMap[pluginIndex].markdown;
      pluginIndex++;

      return marked(replacement);
    });
  }
};

export {
  Parser
};
