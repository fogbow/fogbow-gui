import axios from 'axios';
import { env } from '../defaults/api.config';

let token = localStorage.getItem('token') || env.managerToken;

const config = {
    headers: {
        'federationTokenValue': token
    }
};

class MembersProvider {
    members = env.ms.concat('/members');
    computeQuota = env.ras.concat('/computes/quota/');

    get() {
        return axios.get(this.members);
    }

    getQuota(id) {
        return axios.get(this.computeQuota.concat(id), config);
    }
}

export default new MembersProvider();