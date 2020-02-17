import { messages, getErrorMessage } from '../defaults/messages';
import { toast } from 'react-toastify';

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
const getAllocation = (providerId, cloudName, dispatch, resourceProvider, actionTypes) => {
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
const getAllocations = (providerId, cloudNames, dispatch, resourceProvider, actionTypes) => {
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

/**
 * Returns a list of a specified resource (by th resourceProvider)
 * 
 * Example of actionTypes parameter:
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * const actionTypes = { request, success, failure };
 * 
 * @param {*} dispatch 
 * @param {*} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {*} actionTypes object containing three functions (action types): request, success and failure. 
 */
const listAll = (dispatch, resourceProvider, actionTypes) => {
  return new Promise(async (resolve, reject) => {
    const { request, success, failure } = actionTypes;

    try {
      dispatch(request());
      let response = await resourceProvider.get();
      resolve(dispatch(success(response.data)));
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(messages.orders.getStatus.concat(message));
      reject(dispatch(failure(error)));
    }
  });
};

/**
 * Return a instance of a specified resource (by the resourceProvider)
 * 
 * Example of actionTypes parameter:
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * const actionTypes = { request, success, failure };
 * 
 * @param {String} id The identifier of the instance
 * @param {*} dispatch 
 * @param {*} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {*} actionTypes object containing three functions (action types): request, success and failure. 
 */
const get = (id, dispatch, resourceProvider, actionTypes) => {
  return new Promise(async(resolve, reject) => {
    let { success, failure, request } = actionTypes;
    dispatch(request());

    try {
      let { data } = await resourceProvider.getData(id);
      resolve(dispatch(success(data)));
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(messages.orders.get.concat(id, message));
      reject(dispatch(failure(error)));
    }
  });
};

/**
 * Delete a instance of a specified resource (by the resourceProvider)
 * 
 * Example of actionTypes parameter:
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * const actionTypes = { request, success, failure };
 * 
 * @param {String} id The identifier of the instance
 * @param {*} dispatch 
 * @param {*} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {*} actionTypes object containing three functions (action types): request, success and failure. 
 */
const remove = (id, dispatch, resourceProvider, actionTypes) => {
  return new Promise(async(resolve, reject) => {
    let { success, failure, request } = actionTypes;
    dispatch(request());

    try {
      await resourceProvider.delete(id);
      resolve(dispatch(success()));
    } catch(error) {
      const message = getErrorMessage(error);
      toast.error(messages.orders.remove.concat(id, message));
      reject(dispatch(failure(error)));
    }
  });
};

/**
 * Creates a instance of a specified resource (by the resourceProvider)
 * 
 * Example of actionTypes parameter:
 * const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
 * const success = (allocation) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
 * const failure = (error) => ({ type: volumesActionTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
 * const actionTypes = { request, success, failure };
 * 
 * @param {Object} body the content of the object that must be created
 * @param {*} dispatch 
 * @param {*} resourceProvider a instance of Provider (Example: VolumesProvider, ComputesProvider, etc)
 * @param {*} actionTypes object containing three functions (action types): request, success and failure. 
 */
const create = (body, dispatch, resourceProvider, actionTypes) => {
  return new Promise(async(resolve, reject) => {
    const { success, failure, request } = actionTypes;
    dispatch(request());

    try {
      let { data } = await resourceProvider.create(body);
      resolve(dispatch(success(data.id)))
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(messages.orders.create.concat(message));
      reject(dispatch(failure(error)));
    }
  });
}

const ResourceActions = {
  listAll,
  get,
  delete: remove,
  create,
  getAllocation,
  getAllocations
}

export default ResourceActions;