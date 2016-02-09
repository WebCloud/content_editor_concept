function PluginFactory({ name, markup, style }) {
  return {
    pluginName: name,
    pluginMatch: `{content.${name}}`,
    initPlugin() {
      return `
      ${style}
      ${markup}
      `;
    }
  };
}


export default PluginFactory;
