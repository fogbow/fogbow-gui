import axios from 'axios';
import { env } from '../defaults/api.config';

class MembersProvider {
    members = env.ms.concat('/members');
    computeQuota = env.fns.concat('/computes/quota/');
    config = {
        headers: {
            'federationTokenValue': localStorage.getItem('token')
        }
    };

    get() {
        return axios.get(this.members);
    }

    getQuota(id) {
        return axios.get(this.computeQuota.concat(id), this.config);
    }
}

export default MembersProvider;