import axios from 'axios';
import { env } from '../defaults/api.config';

class VersionProvider {
  get (endpoint) {
    return axios.get(endpoint.concat('/version'), { timeout: env.timeout });
  }
}

export default VersionProvider;
