import axios from 'axios';
import { env } from '../defaults/api.config';

class VolumesProvider {
  url = env.fns.concat('/volumes');

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
}

export default VolumesProvider;
