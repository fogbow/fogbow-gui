import axios from 'axios';
import { env } from '../defaults/api.config';

class AttachmentsProvider {
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    },
    timeout: env.timeout
  };

  create(body) {
    return axios.post(env.serverEndpoint + "/attachments", body, this.config);
  }

  get() {
    return axios.get(env.serverEndpoint + "/attachments".concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(env.serverEndpoint + "/attachments".concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(env.serverEndpoint + "/attachments".concat('/', id), this.config);
  }
}

export default AttachmentsProvider;
