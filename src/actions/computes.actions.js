import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { computesActionsTypes } from './computes.actions.types';
import ComputesProvider from '../providers/computes.provider';
import ResourceActions from './common.actions';

export const getComputes = () => {
  let provider = new ComputesProvider();
  let request = () => ({ type: computesActionsTypes.GET_COMPUTES_REQUEST});
  let success = (computes) => ({ type: computesActionsTypes.GET_COMPUTES_SUCCESS, computes });
  let failure = (error) => ({ type: computesActionsTypes.GET_COMPUTES_FAILURE, error });
  let actionTypes = { request, success, failure };
  return (dispatch) => ResourceActions.listAll(dispatch, provider, actionTypes);
};

export const getComputeData = (id) => {
  let provider = new ComputesProvider();
  const request = () => ({ type: computesActionsTypes.GET_DATA_COMPUTE_REQUEST});
  const success = (compute) => ({ type: computesActionsTypes.GET_DATA_COMPUTE_SUCCESS, compute });
  const failure = (error) => ({ type: computesActionsTypes.GET_DATA_COMPUTE_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.get(id, dispatch, provider, actionTypes);
};

export const getAllComputeAllocation = (providerId, cloudNames) => {
  let resourceProvider = new ComputesProvider();
  const request = () => ({ type: computesActionsTypes.GET_ALL_COMPUTE_ALLOCATION_REQUEST});
  const success = (allocations) => ({ type: computesActionsTypes.GET_ALL_COMPUTE_ALLOCATION_SUCCESS, allocations });
  const failure = (error) => ({ type: computesActionsTypes.GET_ALL_COMPUTE_ALLOCATION_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.getAllocations(providerId, cloudNames, dispatch, resourceProvider, actionTypes);
};

export const getComputeAllocation = (providerId, cloudName) => {
  let resourceProvider = new ComputesProvider();
  const request = () => ({ type: computesActionsTypes.GET_COMPUTE_ALLOCATION_REQUEST});
  const success = (allocation) => ({ type: computesActionsTypes.GET_COMPUTE_ALLOCATION_SUCCESS, allocation });
  const failure = (error) => ({ type: computesActionsTypes.GET_COMPUTE_ALLOCATION_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.getAllocation(providerId, cloudName, dispatch, resourceProvider, actionTypes);
};

export const getImages = (providerId, cloudNames) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ComputesProvider();
      const request = () => ({ type: computesActionsTypes.GET_IMAGES_REQUEST});
      const success = (images) => ({ type: computesActionsTypes.GET_IMAGES_SUCCESS, images });
      const failure = (error) => ({ type: computesActionsTypes.GET_IMAGES_FAILURE, error });

      dispatch(request());
      try {
        const images = {};
        cloudNames.forEach(async(cloudName) => {
          try {
            images[cloudName] = [];
            let imgs = await provider.getImages(providerId, cloudName);
            Object.assign(images[cloudName], imgs.data);
          } catch(error) {
            console.log(error);
            throw error;
          }
        });

        resolve(dispatch(success(images)));
      } catch(error) {
        const message = getErrorMessage(error);
        toast.error(messages.images.get.concat(message));
        reject(dispatch(failure(error)));
      }
    });
  };
};

export const getRemoteImages = (remoteClouds) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ComputesProvider();
      let remoteImages = {};

      const request = () => ({ type: computesActionsTypes.GET_REMOTE_IMAGES_REQUEST});
      const success = (images) => ({ type: computesActionsTypes.GET_REMOTE_IMAGES_SUCCESS, images });
      const failure = (error) => ({ type: computesActionsTypes.GET_REMOTE_IMAGES_FAILURE, error });

      dispatch(request());

      try {
        Object.keys(remoteClouds).forEach((providerId) => {
          remoteImages[providerId] = {};
          remoteClouds[providerId].forEach(async(cloudId) => {
              try {
                let img = await provider.getCloudImages(providerId, cloudId);
                Object.assign(remoteImages[providerId], {[cloudId]: img.data});
              } catch(error) {
                console.log(error);
                throw error;
              }
            });
          });

        resolve(dispatch(success(remoteImages)));
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(messages.images.get.concat(message));
        reject(dispatch(failure(error)));
      }
    });
  };
};

export const createCompute = (body) => {
  let provider = new ComputesProvider();
  const request = () => ({ type: computesActionsTypes.CREATE_COMPUTE_REQUEST});
  const success = (compute) => ({ type: computesActionsTypes.CREATE_COMPUTE_SUCCESS, compute, provider: body.provider });
  const failure = (error) => ({ type: computesActionsTypes.CREATE_COMPUTE_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.create(body, dispatch, provider, actionTypes);
};

export const deleteCompute = (id) => {
  let provider = new ComputesProvider();
  const request = () => ({ type: computesActionsTypes.DELETE_COMPUTE_REQUEST});
  const success = () => ({ type: computesActionsTypes.DELETE_COMPUTE_SUCCESS, id});
  const failure = (error) => ({ type: computesActionsTypes.DELETE_COMPUTE_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.delete(id, dispatch, provider, actionTypes);
};

export const pauseCompute = (id) => {
  let provider = new ComputesProvider();

  const request = () => ({ type: computesActionsTypes.PAUSE_COMPUTE_REQUEST});
  const success = () => ({ type: computesActionsTypes.PAUSE_COMPUTE_SUCCESS, id});
  const failure = (error) => ({ type: computesActionsTypes.PAUSE_COMPUTE_FAILURE, error });

  return dispatch => {
    return new Promise(async(resolve, reject) => {
      dispatch(request());

      try {
        await provider.pause(id);
        resolve(dispatch(success()));
      } catch(error) {
        const message = getErrorMessage(error);
        toast.error(messages.compute.pause.concat(id, message));
        reject(dispatch(failure(error)));
      }
    })
  }
};

export const hibernateCompute = (id) => {
  let provider = new ComputesProvider();

  const request = () => ({ type: computesActionsTypes.HIBERNATE_COMPUTE_REQUEST});
  const success = () => ({ type: computesActionsTypes.HIBERNATE_COMPUTE_SUCCESS, id});
  const failure = (error) => ({ type: computesActionsTypes.HIBERNATE_COMPUTE_FAILURE, error });

  return dispatch => {
    return new Promise(async(resolve, reject) => {
      dispatch(request());

      try {
        await provider.hibernate(id);
        resolve(dispatch(success()));
      } catch(error) {
        const message = getErrorMessage(error);
        toast.error(messages.compute.hibernate.concat(id, message));
        reject(dispatch(failure(error)));
      }
    })
  }
};

export const resumeCompute = (id) => {
  let provider = new ComputesProvider();

  const request = () => ({ type: computesActionsTypes.RESUME_COMPUTE_REQUEST});
  const success = () => ({ type: computesActionsTypes.RESUME_COMPUTE_SUCCESS, id});
  const failure = (error) => ({ type: computesActionsTypes.RESUME_COMPUTE_FAILURE, error });

  return dispatch => {
    return new Promise(async(resolve, reject) => {
      dispatch(request());

      try {
        await provider.resume(id);
        resolve(dispatch(success()));
      } catch(error) {
        const message = getErrorMessage(error);
        toast.error(messages.compute.resume.concat(id, message));
        reject(dispatch(failure(error)));
      }
    })
  }
};