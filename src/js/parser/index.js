import React from 'react';

const pluginRegEx = /\{content\.\w+(\s\{(\w+:\s?('|")?\w+((-|_)\w+){0,}('|")?(,)?\s?){1,}\})?\}/g;
const propsRegEX = /\{(\w+:\s?('|")?\w+((-|_)\w+){0,}('|")?(,)?\s?){1,}\}/g;

const Parser = {
  getChildrenNodes({ template, style }) {
    const node = document.createElement('div');
    node.innerHTML = template;

    return this.parseNodes({ node, style });
  },

  parseNodes({ node: { childNodes = [] }, style }) {
    let nodeList = [];

    childNodes.forEach((node, index) => {
      if (typeof node.tagName === 'undefined') {
        nodeList = nodeList.concat(this.extractPlugins(node.textContent));
      } else {
        const { tagName, className } = node;
        const key = `${tagName}${index}${node.parentNode.tagName}${Math.random()}`;
        let childrenList = null;

        if (node.hasChildNodes()) {
          childrenList = this.parseNodes({ node });
        }

        if (typeof style !== 'undefined') {
          nodeList.push(React.createElement('style', { key: 'main-style' }, style));
        }

        nodeList.push(React.createElement(tagName.toLowerCase(), { className, key }, childrenList));
      }
    });

    return nodeList;
  },

  extractPlugins(node) {
    const editableParts = node.match(pluginRegEx);
    let matches = [];

    if (editableParts !== null) {
      matches = editableParts.map((entry) => {
        const unparsedProps = entry.match(propsRegEX);
        let props = {};

        if (unparsedProps !== null) {
          props = JSON.parse(
                    unparsedProps[0].replace(/\w+:/g, (match) => (`"${match.split(':')[0]}":`))
                                    .replace(/'/g, '"'));
        }

        return {
          pluginName: entry.replace(/(\{)|(content\.)|(\})/g, '').split(' ')[0],
          props
        };
      }).map(({ pluginName, props }, index) => (
        React.createElement(
          require(`./plugins/${pluginName}-plugin`).default,
          Object.assign({ key: `${pluginName}-${index}${Math.random()}` }, props)
        )
      ));
    } else {
      matches = [node];
    }

    return matches;
  }
};

export {
  Parser
};
