import axios from 'axios';
import { env } from '../defaults/api.config';

class ComputesProvider {
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    }
  };

  create(body) {
    return axios.post(env.serverEndpoint + "/computes", body, this.config);
  }

  get() {
    return axios.get(env.serverEndpoint + "/computes".concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(env.serverEndpoint + "/computes".concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(env.serverEndpoint + "/computes".concat('/', id), this.config);
  }

  getImages(providerId) {
    if (providerId) {
      this.config.headers['providerId'] = providerId;
    }

    return axios.get(env.serverEndpoint + "/images", this.config);
  }

  getCloudImages(providerId, cloudId) {
    return axios.get(env.serverEndpoint + "/images".concat('/', providerId, '/', cloudId), this.config);
  }
}

export default ComputesProvider;
