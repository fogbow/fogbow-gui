import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class AttachmentsProvider {
    url = env.manager.concat('/attachments');

    get() {
        return axios.get(this.url.concat('/status'), config);
    }
}

export default new AttachmentsProvider();