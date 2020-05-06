import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { providersActionsTypes } from './providers.actions.types';
import ProvidersProvider from '../providers/providers.provider';
import CloudsProvider from '../providers/clouds.provider';

export const getProviders = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ProvidersProvider();
      const request = () => ({ type: providersActionsTypes.GET_PROVIDERS_REQUEST});
      const success = (providers) => ({ type: providersActionsTypes.GET_PROVIDERS_SUCCESS, providers });
      const failure = (error) => ({ type: providersActionsTypes.GET_PROVIDERS_FAILURE, error });

      dispatch(request());

      provider.get().then(
        providers => resolve(dispatch(success(providers.data.members)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.providers.get.concat(message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getProviderData = (id, cloudId) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ProvidersProvider();
      console.log("[DEBUG] getProviderData("+id+","+cloudId+")");
      const request = () => ({ type: providersActionsTypes.GET_PROVIDER_DATA_REQUEST});
      const success = (quota) => ({ type: providersActionsTypes.GET_PROVIDER_DATA_SUCCESS, quota, id });
      const failure = (error) => ({ type: providersActionsTypes.GET_PROVIDER_DATA_FAILURE, error });

      dispatch(request());

      provider.getQuota(id, cloudId).then(
        quota => resolve(dispatch(success(quota.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.providers.getQuota.concat(id, message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getAllProvidersData = (providers) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let promises = providers.map(providerId => dispatch(getProviderQuotaFromAllClouds(providerId)));

      Promise.all(promises)
        .then(data => {
          let response = data.map(quota => quota)
            .reduce((a,b) => ({
              totalQuota: sumByKey(a.totalQuota, b.totalQuota),
              usedQuota: sumByKey(a.usedQuota, b.usedQuota)
            }));
          resolve(response);
        })
        .catch((error) => {
          const message = getErrorMessage(error);
          toast.error(messages.providers.getAllQuota.concat(message));
          return reject(error);
        });
      });
  };
};

export const getProviderQuotaFromAllClouds = (providerId) => {
  return dispatch => {
    return new Promise(async(resolve, reject) => {
      let provider = new CloudsProvider();
      let promises = [];

      try {
        let clouds = await provider.getCloudsByProviderId(providerId);
        promises = clouds.data.clouds.map(cloudId => dispatch(getProviderData(providerId, cloudId)));
      } catch(error) {
        const message = getErrorMessage(error);
        toast.error(messages.clouds.getRemote.concat(providerId, message));
        return reject(error);
      }

      Promise.all(promises)
        .then(data => {
          let response = data.map(action => action.quota)
            .reduce((a,b) => ({
              totalQuota: sumByKey(a.totalQuota, b.totalQuota),
              usedQuota: sumByKey(a.usedQuota, b.usedQuota)
            }));
          resolve(response);
        })
        .catch((error) => {
          const message = getErrorMessage(error);
          toast.error(messages.providers.getQuota.concat(providerId, message));
          return reject(error);
        });
    });
  };
};

/**
 * Sum the keys of two objects. If any key has a negative value associated with,
 * instead of the sum of the two fields, the result will be -1
 * 
 * @param {Object} obj1 
 * @param {Object} obj2 
 */
const sumByKey = (obj1, obj2) => {
  const sum = {};
  Object.keys(obj1).forEach(key => {
    if (obj2.hasOwnProperty(key)) {
      if (obj1[key] < 0 || obj2[key] < 0) {
        sum[key] = -1;
      } else {
        sum[key] = obj1[key] + obj2[key];
      }
    }
  })
  return sum;
}