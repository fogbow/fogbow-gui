import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class NetworksProvider {
    url = env.manager.concat('/networks');
    fedNetUrl = env.fedenet.concat('/federatedNetworks');

    create(body) {
        return axios.post(this.url, body, config);
    }

    get() {
        return axios.get(this.url.concat('/status'), config);
    }

    getData(id) {
        return axios.get(this.url.concat('/', id), config);
    }

    delete(id) {
        return axios.delete(this.url.concat('/', id), config);
    }

    createFedNet(body) {
        return axios.post(this.fedNetUrl, body, config);
    }

    getFetNets() {
        return axios.get(this.fedNetUrl.concat('/status'), config);
    }

    deletefedNet(id) {
        return axios.delete(this.fedNetUrl.concat('/', id), config);        
    }
}

export default new NetworksProvider();