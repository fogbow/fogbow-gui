import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { volumesActionsTypes } from './volumes.actions.types';
import VolumesProvider from '../providers/volumes.provider';

export const getVolumes = () => {
  return async(dispatch) => {
    let provider = new VolumesProvider();
    const request = () => ({ type: volumesActionsTypes.GET_VOLUMES_REQUEST});
    const success = (volumes) => ({ type: volumesActionsTypes.GET_VOLUMES_SUCCESS, volumes });
    const failure = (error) => ({ type: volumesActionsTypes.GET_VOLUMES_FAILURE, error });
    try {
      dispatch(request());
      let volumes = await provider.get();

      dispatch(success(volumes.data));
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(messages.orders.getStatus.concat(message));
      dispatch(failure(error))
    }
  };
};

export const getVolumeData = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new VolumesProvider();
      const request = () => ({ type: volumesActionsTypes.GET_DATA_VOLUME_REQUEST});
      const success = (volume) => ({ type: volumesActionsTypes.GET_DATA_VOLUME_SUCCESS, volume });
      const failure = (error) => ({ type: volumesActionsTypes.GET_DATA_VOLUME_FAILURE, error });

      dispatch(request());

      provider.getData(id).then(
        volumes => resolve(dispatch(success(volumes.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.get.concat(id, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const createVolume = (body) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new VolumesProvider();
      const request = () => ({ type: volumesActionsTypes.CREATE_VOLUME_REQUEST});
      const success = (volume) => ({ type: volumesActionsTypes.CREATE_VOLUME_SUCCESS, volume, provider: body.provider });
      const failure = (error) => ({ type: volumesActionsTypes.CREATE_VOLUME_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        volume => resolve(dispatch(success(volume.data.id)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.create.concat(message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deleteVolume = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new VolumesProvider();
      const request = () => ({ type: volumesActionsTypes.DELETE_VOLUME_REQUEST});
      const success = () => ({ type: volumesActionsTypes.DELETE_VOLUME_SUCCESS, id });
      const failure = (error) => ({ type: volumesActionsTypes.DELETE_VOLUME_FAILURE, error });

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
