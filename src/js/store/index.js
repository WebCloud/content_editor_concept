const NO_DATA = 'No data to send';

function httpSave({ data, normalizer, pluginId, config }) {
  return new Promise((resolve, reject) => {
    if (data === null) reject({ cause: NO_DATA });
    const { endpoint, ...settings } = config;
    settings.body = data;

    fetch(endpoint, settings)
      .then(normalizer)
      .then((response) => {
        const json = response;
        json.pluginId = json.pluginId || pluginId;
        resolve(json);
      })
      .catch(reject);
  });
}

function store(adapter) {
  function save(rawData) {
    const { save: { config, serializer, normalizer } } = adapter;
    return serializer(rawData)
      .then(({ data, pluginId }) => httpSave({ data, normalizer, pluginId, config }));
  }

  return {
    save
  };
}

export {
  store
};
