import axios from 'axios';
import { env } from '../defaults/api.config';

class AuthProvider {
  asUrl = env.as.concat('/tokens');

  authorize(credentials) {
    const body = {
      'credentials': credentials,
      'publicKey': localStorage.getItem('publicKey')
    };

    return axios.post(this.asUrl, body, this.config);
  }

  getServerPublicKey() {
    return axios.get(env.serverEndpoint + '/publicKey');
  }
}

export default new AuthProvider();
