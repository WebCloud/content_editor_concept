function PluginFactory({ name, markup, style, pluginEvents = [] }) {
  pluginEvents.forEach(({ eventName, eventHander }) => {
    const editor = document.querySelector('.editor');
    editor.addEventListener(eventName, ({ target: { tagName, className } }) => {
      if (tagName.toLowerCase() === 'div' && className === `${name}-plugin`) {
        if (typeof eventHander === 'function') eventHander();
      }
    });
  });

  return {
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
