import axios from 'axios';
import { env } from '../defaults/api.config';

class ProvidersProvider {
  providers = env.ms.concat('/members');
  clouds = env.ms.concat('/clouds');

  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    }
  };

  get() {
    return axios.get(this.providers);
  }

  getQuota(id, cloudId) {
    return axios.get(env.serverEndpoint + "/quota/".concat(id, '/', cloudId), this.config);
  }
}

export default ProvidersProvider;
