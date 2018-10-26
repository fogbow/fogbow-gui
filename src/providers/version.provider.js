import axios from 'axios';

class VersionProvider {
  get(endpoint) {
    return axios.get(endpoint.concat('/version'));
  }
}

export default new VersionProvider();
