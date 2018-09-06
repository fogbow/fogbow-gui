import axios from 'axios';
import { env } from '../defaults/api.config';

let token = localStorage.getItem('token') || env.managerToken;

const config = {
    headers: {
        'federationTokenValue': token
    }
};

class ComputesProvider {
    url = env.manager.concat('/computes');
    imagesUrl = env.manager.concat('/images');

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

    getImages() {
        return axios.get(this.imagesUrl, config);
    }
}

export default new ComputesProvider();