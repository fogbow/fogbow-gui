import axios from 'axios';
import { env } from '../defaults/api.config';

class PublicIPsProvider {
  url = env.fns.concat('/publicIps');
  config = {
    headers: {
      'federationTokenValue': localStorage.getItem('token'),
      'publicKey': localStorage.getItem('publicKey')
    }
  };

  create(body) {
    return axios.post(this.url, body, this.config);
  }

  get() {
    return axios.get(this.url.concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(this.url.concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(this.url.concat('/', id), this.config);
  }

  createSecurityRule(body, id) {
    return axios.post(this.url.concat('/', id, '/', 'securityRules'), body, this.config);
  }

  getSecurityRules(id) {
    return axios.get(this.url.concat('/', id, '/', 'securityRules'), this.config);
  }

  deleteSecurityRule(ruleId, orderId) {
    return axios.delete(this.url.concat('/', orderId, '/', 'securityRules', '/', ruleId),
                        this.config);
  }
}

export default PublicIPsProvider;
