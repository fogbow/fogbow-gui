import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class NetworksProvider {
    url = env.manager.concat('/networks');
    fedNetUrl = env.manager.concat('/federatedNetworks');

    create(body) {
        return axios.post(this.url, body, config);
    }

    get() {
        return axios.get(this.url.concat('/status'), config);
    }

    createFedNet(body) {
        return axios.post(this.fedNetUrl, body, config);
    }

    getFetNets() {
        return axios.get(this.fedNetUrl.concat('/status'), config);
    }
}

export default new NetworksProvider();