import React from 'react';

const pluginRegEx = /\{content\.\w+(\s\{(\w+:\s?('|")?\w+((-|_)\w+){0,}('|")?(,)?\s?){1,}\})?\}/g;
const propsRegEX = /\{(\w+:\s?('|")?\w+((-|_)\w+){0,}('|")?(,)?\s?){1,}\}/g;

const Parser = {
  getChildrenNodes(template) {
    const pluginList = this.getPlugins(template);
    const childrenNodes = pluginList.map(({ pluginName, props }, index) => (
      React.createElement(
        require(`./plugins/${pluginName}-plugin`).default,
        Object.assign({ key: `${pluginName}-${index}` }, props)
      )
    ));

    return childrenNodes;
  },

  getPlugins(template) {
    const editableParts = template.match(pluginRegEx);
    const pluginMatches = editableParts.map((entry) => {
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
    });

    return pluginMatches;
  }
};

export {
  Parser
};
