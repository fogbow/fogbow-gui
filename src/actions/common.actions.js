import { messages, getErrorMessage } from '../defaults/messages';

/**
 * Get user allocation from a specified cloud and resource.
 * 
 * Example of actionTypes parameter:
 *  
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * const actionTypes = { request, success, failure };
 * 
 * @param {String} providerId 
 * @param {String} cloudName 
 * @param {*} dispatch
 * @param {Provider} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {Object} request object containing three functions (action types): request, success and failure. 
 */
export const getAllocation = (providerId, cloudName, dispatch, resourceProvider, actionTypes) => {
  return new Promise(async (resolve, reject) => {
    const { request, success, failure } = actionTypes;

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
      const message = getErrorMessage(error);
      toast.error(messages.allocations.get.concat(cloudName, message));
      reject(dispatch(failure(error)));
    }
  });
};

/**
 * Get user allocation from a specified cloud and resource.
 * 
 * Example of actionTypes parameter:
 *  
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * const actionTypes = { request, success, failure };
 * 
 * @param {String} providerId 
 * @param {[String]} cloudNames a list of cloud names
 * @param {*} dispatch
 * @param {Provider} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {Object} request object containing three functions (action types): request, success and failure. 
 */
export const getAllocations = (providerId, cloudNames, dispatch, resourceProvider, actionTypes) => {
  return new Promise((resolve, reject) => {
    const { request, success, failure } = actionTypes;

    dispatch(request());

    try {
      let promises = cloudNames.map(async (cloudName) => {
        try {
          let response = await resourceProvider.getAllocation(providerId, cloudName);
          let allocation = response.data;
          return {
            ...allocation,
            cloudName
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      });

      Promise.all(promises).then(result => {
        const allocations = {};
        result.forEach(allocation => {
          allocations[allocation.cloudName] = {};
          Object.assign(allocations[allocation.cloudName], allocation);
          delete allocations[allocation.cloudName].cloudName;
        })

        resolve(dispatch(success(allocations)));
      })
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(messages.allocations.get.concat(message));
      reject(dispatch(failure(error)));
    }
  });
};