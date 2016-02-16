import React from 'react';

// RegEx for the plugin syntax: {content.pluginName {pluginProp: 'propValue'}}
const pluginRegEx = /\{content\.\w+(\s\{(\w+:\s?('|")?\w+((-|_|\s)\w+){0,}('|")?(,)?\s?){1,}\})?\}/g;
// RegEx for the plugin props part on the plugin syntax, using JSON-like values
const propsRegEX = /\{(\w+:\s?('|")?\w+((-|_|\s)\w+){0,}('|")?(,)?\s?){1,}\}/g;

// Object to be used as the this keyworkd on each new instance for the mapPluginMarkdown
// function, in order to get the markdown content out of the Parser plugins
const pluginMap = {
  pluginMarkdownMap: ['']
};

const Parser = {
  getChildrenNodes({ template, style }) {
    // Transform the template into a DOM tree in order to better transverse it
    // and transform it into React elements to be rendered into the screen

    const node = document.createElement('div');
    node.innerHTML = template;

    // Call parseNodes in order to transform the childNodes into React Elements
    // or into Parser plugin instances. Return the parsed nodes to be rendered.
    return this.parseNodes({ node, style });
  },

  parseNodes({ node: { childNodes = [] }, style }) {
    let nodeList = [];

    childNodes.forEach((node, index) => {
      // Ff the node has no tagName it indicates that it is a text, it could be
      // just a text or a snippet for the plugin syntax e.g: {content.image ...}
      if (typeof node.tagName === 'undefined') {
        // Call extractPlugins to check for snippets for the plugin syntax.
        // Receive in return an array of node lists to be concatenated into our
        // current node list.
        nodeList = nodeList.concat(this.extractPlugins(node.textContent));
      } else {
        const { tagName, className } = node;
        const key = `${tagName}${index}${node.parentNode.tagName}${Math.random()}`;
        let childrenList = null;

        // If we have childNodes call parseNodes on the node to keep trasversing
        // and parsing the tree. Receive the result into a array, childrenList
        if (node.hasChildNodes()) {
          childrenList = this.parseNodes({ node });
        }

        // If we have style defined to be used, create a style tag for inline
        // styling the component
        if (typeof style !== 'undefined') {
          nodeList.push(React.createElement('style', { key: 'main-style' }, style));
        }

        nodeList.push(React.createElement(tagName.toLowerCase(), { className, key }, childrenList));
      }
    });

    return nodeList;
  },

  extractPlugins(node) {
    // Receive any matches for the plugin syntax
    const editableParts = node.match(pluginRegEx);
    let matches = [];

    if (editableParts !== null) {
      // If we find plugin matches map them into React Elements on a two part step
      matches = editableParts.map((entry) => {
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
          props
        };
      }).map(({ pluginName, props }, index) => (
        // Require the React component and create a new React element with it
        React.createElement(
          require(`./plugins/${pluginName}-plugin`).default,
          Object.assign({ key: `${pluginName}-${index}${Math.random()}` }, props)
        )
      ));
    } else {
      // If no plugin syntax is found, simply return the text
      matches = [node];
    }

    return matches;
  },

  mapPluginMarkdown(markdown, pluginIndex) {
    this.pluginMarkdownMap[pluginIndex] = markdown;
  },

  // Handler function to be called from the ContentEditor in order to extract the
  // markdown out of the Parser plugin instances
  previewHandler() {
    alert(pluginMap.pluginMarkdownMap.join('\n'));
    return pluginMap.pluginMarkdownMap;
  }
};

export {
  Parser
};
