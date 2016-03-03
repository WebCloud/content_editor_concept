const headers = {
  Authorization: 'Bearer <token>',
  'Content-Type': 'application/octet-stream'
};

export default {
  save: {
    serializer(data) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        const plugin = data.reduce((previous, { pluginData = {}, pluginId }) => {
          const { file } = pluginData;
          if (typeof file === 'undefined'
            || file === null
            || typeof file.name === 'undefined') {
            return previous;
          }

          return { file, pluginId };
        }, { file: null });

        reader.onload = ({ target: { result } }) => {
          resolve({ data: result, pluginId: plugin.pluginId });
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(plugin.file);
      });
    },

    normalizer(response) {
      return new Promise((resolve, reject) => {
        const {
          path_lower: path
        } = response.json();
        const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

        fetch(url, {
          method: 'POST',
          headers,
          body: {
            path
          }
        }).then((data) => {
          const json = data.json();
          return json.url.replace('?dl=0', '?dl=1');
        }).then((json) => resolve(json)).catch((reason) => reject(reason));
      });
    },

    config: {
      endpoint: 'https://content.dropboxapi.com/2/files/upload?path=/',
      headers,
      method: 'PUT',
      mode: 'cors'
    }
  }
};
