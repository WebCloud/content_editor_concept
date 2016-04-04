export default {
  save: {
    serialize(data) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        let pluginId = null;

        data.forEach(({ pluginData = {}, pluginId: id }) => {
          const { file } = pluginData;
          if (typeof file === 'undefined'
            || file === null
            || typeof file.name === 'undefined') {
            return;
          }

          formData.append('pluginId', id);
          formData.append('asset', file);
          pluginId = id;
        });

        if (typeof formData.entries().next().value === 'undefined') reject();

        resolve({ data: formData, pluginId });
      });
    },

    normalize(response) {
      return response.json();
    },

    config: {
      endpoint: '/asset',
      method: 'POST'
    }
  }
};
