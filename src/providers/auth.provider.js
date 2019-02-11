import axios from 'axios';
import { env } from '../defaults/api.config';

class AuthProvider {
  asUrl = env.as.concat('/tokens');
  fnsUrl = env.fns.concat('/publicKey');

  config = {
    headers: {
      'publicKey': localStorage.getItem('publicKey')
    }
  };

  authorize(credentials) {
    return axios.post(this.asUrl, credentials, this.config);
  }

  getFnsPublicKey() {
    return axios.get(this.fnsUrl);
  }
}

export default new AuthProvider();
