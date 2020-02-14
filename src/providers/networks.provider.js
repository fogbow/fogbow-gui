import axios from 'axios';
import { env } from '../defaults/api.config';

class NetworksProvider {
  fedNetUrl = env.fns.concat('/federatedNetworks');
  config = {
    headers: {
      'Fogbow-User-Token': localStorage.getItem('token'),
    }
  };

  create(body) {
    return axios.post(env.serverEndpoint + "/networks", body, this.config);
  }

  get() {
    return axios.get(env.serverEndpoint + "/networks".concat('/status'), this.config);
  }

  getData(id) {
    return axios.get(env.serverEndpoint + "/networks".concat('/', id), this.config);
  }

  delete(id) {
    return axios.delete(env.serverEndpoint + "/networks".concat('/', id), this.config);
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
    return axios.post(env.serverEndpoint + "/networks".concat('/', id, '/', 'securityRules'), body, this.config);
  }

  getSecurityRules(id) {
    return axios.get(env.serverEndpoint + "/networks".concat('/', id, '/', 'securityRules'), this.config);
  }

  deleteSecurityRule(ruleId, orderId) {
    return axios.delete(env.serverEndpoint + "/networks".concat('/', orderId, '/', 'securityRules', '/', ruleId),
                        this.config);
  }

  getAllocation(providerId, cloudName) {
    return axios.get(env.serverEndpoint + "/networks/allocation".concat('/', providerId, '/', cloudName), this.config);
  }
}

export default NetworksProvider;
