import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class NetworksProvider {
    url = env.manager.concat('/networks');

    get() {
        return axios.get(this.url.concat('/status'), config);
    }
}

export default new NetworksProvider();