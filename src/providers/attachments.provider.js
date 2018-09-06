import axios from 'axios';
import { env } from '../defaults/api.config';

let token = localStorage.getItem('token') || env.managerToken;

const config = {
    headers: {
        'federationTokenValue': token
    }
};

class AttachmentsProvider {
    url = env.manager.concat('/attachments');

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
}

export default new AttachmentsProvider();