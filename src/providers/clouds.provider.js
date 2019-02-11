import axios from 'axios';
import { env } from '../defaults/api.config';

class CloudsProvider {
  clouds = env.fns.concat('/clouds/');
  config = {
    headers: {
      'federationTokenValue': localStorage.getItem('token'),
      'publicKey': localStorage.getItem('publicKey')
    }
  };

  get() {
    return axios.get(this.clouds, this.config);
  }

  getCloudsByMemberId(id) {
    return axios.get(this.clouds.concat(id), this.config);
  }
}

export default CloudsProvider;
