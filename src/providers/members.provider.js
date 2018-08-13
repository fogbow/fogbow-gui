import axios from 'axios';
import { env } from '../defaults/api.config';

class MembersProvider {
    url = env.membership.concat('/members');

    get() {
        return axios.get(this.url);
    }
}

export default new MembersProvider();