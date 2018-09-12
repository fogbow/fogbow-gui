import axios from 'axios';
import { env } from '../defaults/api.config';

let token = localStorage.getItem('token') || env.managerToken;

const config = {
    headers: {
        'federationTokenValue': token
    }
};

class NetworksProvider {
    url = env.ras.concat('/networks');
    fedNetUrl = env.fns.concat('/federatedNetworks');

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

    getFedNetData(id) {
        return axios.get(this.fedNetUrl.concat('/', id), config);
    }

    deletefedNet(id) {
        return axios.delete(this.fedNetUrl.concat('/', id), config);        
    }
}

export default new NetworksProvider();