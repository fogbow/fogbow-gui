import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { providersActionsTypes } from './providers.actions.types';
import ProvidersProvider from '../providers/providers.provider';
import CloudsProvider from '../providers/clouds.provider';

/**
 * Get user allocation from a specified cloud and resource.
 *
 * 
 * Example of request, success and failure parameters:
 *  
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * 
 * @param {String} providerId 
 * @param {String} cloudName 
 * @param {Provider} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {function} request function that must retrieve a object with type field filled with a resource action type
 * @param {function} success function that given a data it must build a object with a resource action type and the retrieving data
 * @param {function} failure function that given a error it must build a object with a resource action type and the retrieving error
 */
export const getAllocation = (providerId, cloudName, resourceProvider, request, success, failure) => {
  return (dispatch) => {
    new Promise(async(resolve, reject) => {
      dispatch(request());
  
      try {
          try {
            let allocation = await resourceProvider.getAllocation(providerId, cloudName);
            resolve(dispatch(success(allocation.data)));
          } catch (error) {
            console.error(error);
            throw error;
          }
      } catch (error) {
        // const message = getErrorMessage(error);
        // toast.error(messages.allocations.get.concat(message));
        reject(dispatch(failure(error)));
      }
    });
  }
};

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
              totalQuota: sumAllocation(a.totalQuota, b.totalQuota),
              usedQuota: sumAllocation(a.usedQuota, b.usedQuota),
              availableQuota: sumAllocation(a.availableQuota, b.availableQuota)
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
              totalQuota: sumAllocation(a.totalQuota, b.totalQuota),
              usedQuota: sumAllocation(a.usedQuota, b.usedQuota),
              availableQuota: sumAllocation(a.availableQuota, b.availableQuota)
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

const sumAllocation = (a, b) => {
  return {
    vCPU: a.vCPU + b.vCPU,
    ram: a.ram + b.ram,
    instances: a.instances + b.instances
  }
}
