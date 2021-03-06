import axios from 'axios';
import { env } from '../defaults/api.config';

class ComputesProvider {
  url = env.fns.concat('/computes');
  imagesUrl = env.fns.concat('/images');

  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    }
  };

  create(body) {
    return axios.post(this.url, body, this.config);
  }

  get() {
    return axios.get(this.url.concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(this.url.concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(this.url.concat('/', id), this.config);
  }

  getImages(providerId) {
    if (providerId) {
      this.config.headers['providerId'] = providerId;
    }

    return axios.get(this.imagesUrl, this.config);
  }

  getCloudImages(providerId, cloudId) {
    return axios.get(this.imagesUrl.concat('/', providerId, '/', cloudId), this.config);
  }
}

export default ComputesProvider;
