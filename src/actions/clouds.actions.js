import { toast } from 'react-toastify';

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
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to retrieve local provider clouds list. ' + message + '.');
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getRemoteClouds = (membersIds) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new CloudsProvider();
      let remoteClouds = {};

      const request = () => ({ type: cloudsActionsTypes.GET_REMOTE_CLOUDS_REQUEST});
      const success = (clouds) => ({ type: cloudsActionsTypes.GET_REMOTE_CLOUDS_SUCCESS, clouds });
      const failure = (error) => ({ type: cloudsActionsTypes.GET_REMOTE_CLOUDS_FAILURE, error });

      dispatch(request());

      membersIds.map(async(memberId) => {
        try {
          let cloud = await provider.getCloudsByMemberId(memberId);
          remoteClouds[memberId] = cloud.data.clouds;
        } catch(error) {
          const message = error.response ? error.response.data.message : error.message;
          toast.error('Unable to retrieve clouds list from provider: ' + memberId + '. ' + message + '.');
          return reject(dispatch(failure(error)))
        }
      });

      resolve(dispatch(success(remoteClouds)));
    });
  };
};

export const getCloudsByMemberId = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new CloudsProvider();
      const request = () => ({ type: cloudsActionsTypes.GET_MEMBER_CLOUDS_REQUEST});
      const success = (clouds) => ({ type: cloudsActionsTypes.GET_MEMBER_CLOUDS_SUCCESS, clouds, id });
      const failure = (error) => ({ type: cloudsActionsTypes.GET_MEMBER_CLOUDS_FAILURE, error });

      dispatch(request());

      provider.getCloudsByMemberId(id).then(
        clouds => resolve(dispatch(success(clouds.data.clouds)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to retrieve clouds list from provider: ' + id + '. ' + message + '.');
        return reject(dispatch(failure(error)))
      });
    });
  };
};
