import axios from 'axios';
import { env } from '../defaults/api.config';

class ComputesProvider {
    url = env.fns.concat('/computes');
    imagesUrl = env.fns.concat('/images');

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

    getImages(memberId) {
      if (memberId) {
        this.config.headers['memberId'] = memberId;
      }

      return axios.get(this.imagesUrl, this.config);
    }

    getCloudImages(memberId, cloudId) {
      return axios.get(this.imagesUrl.concat('/', memberId, '/', cloudId), this.config);
    }
}

export default ComputesProvider;
