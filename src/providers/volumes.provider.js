import axios from 'axios';
import { env } from '../defaults/api.config';

class VolumesProvider {
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    },
    timeout: env.timeout
  };

  create(body) {
    return axios.post(env.serverEndpoint + '/volumes', body, this.config);
  }

  get() {
    return axios.get(env.serverEndpoint + '/volumes'.concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(env.serverEndpoint + '/volumes'.concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(env.serverEndpoint + '/volumes'.concat('/', id), this.config);
  }

  getAllocation(providerId, cloudName) {
    return axios.get(env.serverEndpoint + "/volumes/allocation".concat('/', providerId, '/', cloudName), this.config);
  }
}

export default VolumesProvider;
