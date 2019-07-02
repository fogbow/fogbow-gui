import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { cloudsActionsTypes } from './clouds.actions.types';
import CloudsProvider from '../providers/clouds.provider';

export const getLocalClouds = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new CloudsProvider();
      const request = () => ({ type: cloudsActionsTypes.GET_LOCAL_CLOUDS_REQUEST});
      const success = (clouds) => ({ type: cloudsActionsTypes.GET_LOCAL_CLOUDS_SUCCESS, clouds });
      const failure = (error) => ({ type: cloudsActionsTypes.GET_LOCAL_CLOUDS_FAILURE, error });

      dispatch(request());

      provider.get().then(
        clouds => resolve(dispatch(success(clouds.data.clouds)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.clouds.getLocal.concat(message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getRemoteClouds = (providerIds) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new CloudsProvider();
      let remoteClouds = {};

      const request = () => ({ type: cloudsActionsTypes.GET_REMOTE_CLOUDS_REQUEST});
      const success = (clouds) => ({ type: cloudsActionsTypes.GET_REMOTE_CLOUDS_SUCCESS, clouds });
      const failure = (error) => ({ type: cloudsActionsTypes.GET_REMOTE_CLOUDS_FAILURE, error });

      dispatch(request());

      providerIds.map(async(providerId) => {
        try {
          let cloud = await provider.getCloudsByProviderId(providerId);
          remoteClouds[providerId] = cloud.data.clouds;
        } catch(error) {
          const message = getErrorMessage(error);
          toast.error(messages.clouds.getRemote.concat(providerId, message));
          return reject(dispatch(failure(error)))
        }
      });

      resolve(dispatch(success(remoteClouds)));
    });
  };
};

export const getCloudsByProviderId = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new CloudsProvider();
      const request = () => ({ type: cloudsActionsTypes.GET_PROVIDER_CLOUDS_REQUEST});
      const success = (clouds) => ({ type: cloudsActionsTypes.GET_PROVIDER_CLOUDS_SUCCESS, clouds, id });
      const failure = (error) => ({ type: cloudsActionsTypes.GET_PROVIDER_CLOUDS_FAILURE, error });

      dispatch(request());

      provider.getCloudsByProviderId(id).then(
        clouds => resolve(dispatch(success(clouds.data.clouds)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.clouds.getRemote.concat(id, message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};
