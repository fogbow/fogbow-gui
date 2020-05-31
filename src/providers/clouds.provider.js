import axios from 'axios';
import { env } from '../defaults/api.config';

class CloudsProvider {
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    },
    timeout: env.timeout
  };

  get() {
    return axios.get(env.serverEndpoint + "/clouds/", this.config);
  }

  getCloudsByProviderId(id) {
    return axios.get(env.serverEndpoint + "/clouds/".concat(id), this.config);
  }
}

export default CloudsProvider;
