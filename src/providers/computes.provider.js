import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        federationTokenValue: env.managerToken
    }
};

class ComputesProvider {
    url = env.manager.concat('/computes');

    get() {
        return axios.get(this.url, config);
    }
}

export default new ComputesProvider();