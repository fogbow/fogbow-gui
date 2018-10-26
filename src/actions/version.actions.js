import { toast } from 'react-toastify';

import { env } from '../defaults/api.config';
import { versionActionsTypes } from './version.actions.types';
import VersionProvider from '../providers/version.provider';

export const getVersion = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const request = () => ({ type: versionActionsTypes.GET_VERSION_REQUEST });
      const success = (version) => ({ type: versionActionsTypes.GET_VERSION_SUCCESS, version });
      const failure = (error) => ({ type: versionActionsTypes.GET_VERSION_FAILURE, error });

      dispatch(request());

      const apiEndpoints = {
        'Federated Network Service': env.fns,
        'Membership Service': env.ms
      };

      let response = {};

      try {
        let provider = new VersionProvider();

        Object.keys(apiEndpoints).map(async(service) => {
          try {
            let endpoint = await provider.get(apiEndpoints[service]);
            response[service] = endpoint.data;
          } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            toast.error('Unable to retrieve version from endpoint: ' + service + '. ' + message);
            return reject(error);
          }
        });

        resolve(dispatch(success(response)));
      } catch (error) {
        return reject(dispatch(failure(error)));
      }
    });
  };
};
