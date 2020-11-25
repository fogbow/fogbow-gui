import axios from 'axios';
import { env } from '../defaults/api.config';

const emptyBody = {}

class ComputesProvider {
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    },
    timeout: env.timeout
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

  getImages(providerId, cloudName) {
    return axios.get(env.serverEndpoint + "/images".concat('/', providerId, '/', cloudName), this.config);
  }

  getCloudImages(providerId, cloudId) {
    return axios.get(env.serverEndpoint + "/images".concat('/', providerId, '/', cloudId), this.config);
  }

  getAllocation(providerId, cloudName) {
    return axios.get(env.serverEndpoint + "/computes/allocation".concat('/', providerId, '/', cloudName), this.config);
  }

  pause(id) {
    return axios.post(env.serverEndpoint + "/computes".concat('/', id, '/pause'), emptyBody, this.config);
  }

  hibernate(id) {
    return axios.post(env.serverEndpoint + "/computes".concat('/', id, '/hibernate'), emptyBody, this.config);
  }

  resume(id) {
    return axios.post(env.serverEndpoint + "/computes".concat('/', id, '/resume'), emptyBody, this.config);
  }

  takeSnapshot(id, body) {
    return axios.post(env.serverEndpoint + "/computes".concat('/', id, '/snapshot'), body, this.config);
  }
}

export default ComputesProvider;
