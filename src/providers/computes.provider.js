import axios from 'axios';
import { env } from '../defaults/api.config';

class ComputesProvider {
    url = env.ras.concat('/computes');
    imagesUrl = env.ras.concat('/images');

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

    getImages() {
        return axios.get(this.imagesUrl, this.config);
    }
}

export default ComputesProvider;