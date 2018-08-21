import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class VolumesProvider {
    url = env.manager.concat('/volumes');

    get() {
        return axios.get(this.url.concat('/status'), config);
    }
}

export default new VolumesProvider();