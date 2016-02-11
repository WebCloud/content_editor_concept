function PluginFactory({ name, markup, style, pluginEvents = [] }) {
  pluginEvents.forEach(({ eventName, eventHander }) => {
    const editor = document.querySelector('.editor');
    editor.addEventListener(eventName, ({ target: { tagName, className } }) => {
      debugger
      if (tagName.toLowerCase() === 'div' && className === `${name}-plugin`) {
        if (typeof eventHander === 'function') eventHander();
      }
    });
  });

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
