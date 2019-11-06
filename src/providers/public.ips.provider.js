import axios from 'axios';
import { env } from '../defaults/api.config';

class PublicIPsProvider {
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    }
  };

  create(body) {
    return axios.post(env.serverEndpoint + '/publicIps', body, this.config);
  }

  get() {
    return axios.get(env.serverEndpoint + '/publicIps'.concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(env.serverEndpoint + '/publicIps'.concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(env.serverEndpoint + '/publicIps'.concat('/', id), this.config);
  }

  createSecurityRule(body, id) {
    return axios.post(env.serverEndpoint + '/publicIps'.concat('/', id, '/', 'securityRules'), body, this.config);
  }

  getSecurityRules(id) {
    return axios.get(env.serverEndpoint + '/publicIps'.concat('/', id, '/', 'securityRules'), this.config);
  }

  deleteSecurityRule(ruleId, orderId) {
    return axios.delete(env.serverEndpoint + '/publicIps'.concat('/', orderId, '/', 'securityRules', '/', ruleId),
                        this.config);
  }
}

export default PublicIPsProvider;
