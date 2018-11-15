import axios from 'axios';
import { env } from '../defaults/api.config';

class NetworksProvider {
  url = env.fns.concat('/networks');
  fedNetUrl = env.fns.concat('/federatedNetworks');
  config = {
    headers: {
        'federationTokenValue': localStorage.getItem('token')
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

  createFedNet(body) {
    return axios.post(this.fedNetUrl, body, this.config);
  }

  getFetNets() {
    return axios.get(this.fedNetUrl.concat('/status'), this.config);
  }

  getFedNetData(id) {
    return axios.get(this.fedNetUrl.concat('/', id), this.config);
  }

  deletefedNet(id) {
    return axios.delete(this.fedNetUrl.concat('/', id), this.config);
  }

  createSecurityRule(body, id) {
    return axios.post(this.url.concat('/', id, '/', 'securityRules'), body, this.config);
  }

  getSecurityRules(id) {
    return axios.get(this.url.concat('/', id, '/', 'securityRules'), this.config);
  }

  deleteSecurityRule(ruleId, orderId) {
    return axios.get(this.url.concat('/', orderId, '/', 'securityRules', '/', ruleId),
                     this.config);
  }
}

export default NetworksProvider;
