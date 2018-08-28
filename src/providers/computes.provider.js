import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class ComputesProvider {
    url = env.manager.concat('/computes');
    imagesUrl = env.manager.concat('/images');

    get() {
        return axios.get(this.url.concat('/status'), config);
    }

    getImages() {
        return axios.get(this.imagesUrl, config);
    }
}

export default new ComputesProvider();