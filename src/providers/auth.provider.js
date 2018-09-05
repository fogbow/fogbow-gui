import axios from 'axios';
import { env } from '../defaults/api.config';

class AuthProvider {
    url = env.manager.concat('/tokens');

    authorize(credentials) {
        return axios.post(this.url, credentials);
    }
}

export default new AuthProvider();