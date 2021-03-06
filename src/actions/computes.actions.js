import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { computesActionsTypes } from './computes.actions.types';
import ComputesProvider from '../providers/computes.provider';

export const getComputes = () => {
  return async(dispatch) => {
    let provider = new ComputesProvider();

    const request = () => ({ type: computesActionsTypes.GET_COMPUTES_REQUEST});
    const success = (computes) => ({ type: computesActionsTypes.GET_COMPUTES_SUCCESS, computes });
    const failure = (error) => ({ type: computesActionsTypes.GET_COMPUTES_FAILURE, error });

    try {
      dispatch(request());
      let computes = await provider.get();

      dispatch(success(computes.data));
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(messages.orders.getStatus.concat(message));
      dispatch(failure(error));
    }
  };
};

export const getComputeData = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ComputesProvider();
      const request = () => ({ type: computesActionsTypes.GET_DATA_COMPUTE_REQUEST});
      const success = (compute) => ({ type: computesActionsTypes.GET_DATA_COMPUTE_SUCCESS, compute });
      const failure = (error) => ({ type: computesActionsTypes.GET_DATA_COMPUTE_FAILURE, error });

      dispatch(request());

      provider.getData(id).then(
        compute => resolve(dispatch(success(compute.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.get.concat(id, message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getImages = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ComputesProvider();
      const request = () => ({ type: computesActionsTypes.GET_IMAGES_REQUEST});
      const success = (images) => ({ type: computesActionsTypes.GET_IMAGES_SUCCESS, images });
      const failure = (error) => ({ type: computesActionsTypes.GET_IMAGES_FAILURE, error });

      dispatch(request());

      provider.getImages().then(
        images => resolve(dispatch(success(images.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.images.get.concat(message));
        return reject(dispatch(failure(error)));
      });
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
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ComputesProvider();
      const request = () => ({ type: computesActionsTypes.CREATE_COMPUTE_REQUEST});
      const success = (compute) => ({ type: computesActionsTypes.CREATE_COMPUTE_SUCCESS, compute, provider: body.provider });
      const failure = (error) => ({ type: computesActionsTypes.CREATE_COMPUTE_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        compute => resolve(dispatch(success(compute.data.id)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.create.concat(message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deleteCompute = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new ComputesProvider();
      const request = () => ({ type: computesActionsTypes.DELETE_COMPUTE_REQUEST});
      const success = () => ({ type: computesActionsTypes.DELETE_COMPUTE_SUCCESS, id});
      const failure = (error) => ({ type: computesActionsTypes.DELETE_COMPUTE_FAILURE, error });

      dispatch(request());

      provider.delete(id).then(
        () => resolve(dispatch(success()))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.remove.concat(id, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};
