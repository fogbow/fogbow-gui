import axios from 'axios';
import { env } from '../defaults/api.config';

class AttachmentsProvider {
    url = env.fns.concat('/attachments');
    config = {
        headers: {
            'federationTokenValue': localStorage.getItem('token'),
            'publicKey': localStorage.getItem('publicKey')
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
}

export default AttachmentsProvider;
