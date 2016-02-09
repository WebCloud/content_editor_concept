const Parser = {
  parse(template) {
    const pluginList = this.getPlugins(template);
    const parsedTemplate = pluginList.map((plugin) => (
      require(`./plugins/${plugin}-plugin`)
    )).reduce((compiledTemplate, { default: { pluginMatch, initPlugin } }) => (
      compiledTemplate.replace(pluginMatch, initPlugin())
    ), template);

    return parsedTemplate;
  },

  getPlugins(template) {
    const editableParts = template.match(/\{content\.\w+\}/g);
    const pluginMatches = editableParts.map((entry) => (
      entry.replace(/(\{)|(content\.)|(\})/g, '')
    ));

    return pluginMatches;
  }
};

export {
  Parser
};
