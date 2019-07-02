import axios from 'axios';
import { env } from '../defaults/api.config';

class ProvidersProvider {
  providers = env.ms.concat('/members');
  clouds = env.ms.concat('/clouds');
  computeQuota = env.fns.concat('/computes/quota/');

  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    }
  };

  get() {
    return axios.get(this.providers);
  }

  getQuota(id, cloudId) {
    return axios.get(this.computeQuota.concat(id, '/', cloudId), this.config);
  }
}

export default ProvidersProvider;
