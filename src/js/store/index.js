const NO_DATA = 'No data to send';

function httpSave({ data, config }) {
  return new Promise((resolve, reject) => {
    if (data === null) reject({ cause: NO_DATA });
    const { endpoint, ...settings } = config;
    settings.body = data;

    fetch(endpoint, settings)
      .then((response) => resolve(response))
      .catch(reject);
  });
}

function store(adapter) {
  function save({ rawData }) {
    const { save: { config, serialize, normalize } } = adapter;
    return serialize(rawData)
      .then(({ data, pluginIds }) => httpSave({ data, config })
      .then(normalize)
      .then((response) => {
        const json = response;
        json.pluginId = json.pluginId || pluginIds[0];
        return json;
      }));
  }

  return {
    save
  };
}

export {
  store
};
