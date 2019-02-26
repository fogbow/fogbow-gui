import axios from 'axios';
import { env } from '../defaults/api.config';

class AuthProvider {
  asUrl = env.as.concat('/tokens');
  fnsUrl = env.fns.concat('/publicKey');

  authorize(credentials) {
    const body = {
      'credentials': credentials,
      'publicKey': localStorage.getItem('publicKey')
    };

    return axios.post(this.asUrl, body, this.config);
  }

  getFnsPublicKey() {
    return axios.get(this.fnsUrl);
  }
}

export default new AuthProvider();
