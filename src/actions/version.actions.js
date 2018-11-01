import { toast } from 'react-toastify';

import packageJson from '../../package.json';
import build from '../defaults/build.json';
import { env } from '../defaults/api.config';
import { versionActionsTypes } from './version.actions.types';
import VersionProvider from '../providers/version.provider';

export const getVersion = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new VersionProvider();
      let response = {
        'Fogbow GUI': packageJson.version + '-' + build.build_number
      };

      const request = () => ({ type: versionActionsTypes.GET_VERSION_REQUEST });
      const success = (version) => ({ type: versionActionsTypes.GET_VERSION_SUCCESS, version });
      const failure = (error) => ({ type: versionActionsTypes.GET_VERSION_FAILURE, error });

      const apiEndpoints = {
        'Federated Network Service': env.fns,
        'Resource Allocation Service': env.ras,
        'Membership Service': env.ms
      };

      dispatch(request());

      try {
        Object.keys(apiEndpoints).map(async(service) => {
          try {
            let endpoint = await provider.get(apiEndpoints[service]);
            response[service] = endpoint.data;
          } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            toast.error('Unable to retrieve version from service: ' + service + '. ' + message);
            throw (message);
          }
        });

        resolve(dispatch(success(response)));
      } catch (error) {
        console.log(error);
        reject(dispatch(failure(error)));
      }
    });
  };
};
