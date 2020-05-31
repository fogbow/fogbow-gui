import axios from 'axios';
import { env } from '../defaults/api.config';

class AuthProvider {
  asUrl = env.as.concat('/tokens');
  config = {
    timeout: env.timeout
  }

  authorize(credentials) {
    const body = {
      'credentials': credentials,
      'publicKey': localStorage.getItem('publicKey')
    };

    return axios.post(this.asUrl, body, this.config);
  }

  getServerPublicKey() {
    return axios.get(env.serverEndpoint + '/publicKey', this.config);
  }
}

export default new AuthProvider();
