import axios from 'axios';
import { env } from '../defaults/api.config';

const config = {
    headers: {
        'federationTokenValue': env.managerToken
    }
};

class MembersProvider {
    members = env.membership.concat('/members');
    computeQuota = env.manager.concat('/computes/quota/');

    get() {
        return axios.get(this.members);
    }

    getQuota(id) {
        return axios.get(this.computeQuota.concat(id), config);
    }
}

export default new MembersProvider();