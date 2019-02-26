import { toast } from 'react-toastify';

import { generateErrorMessage, errorTypes, orderTypes } from '../defaults/messages';
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
      toast.error(generateErrorMessage(errorTypes.GET, orderTypes.VOLUME));
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
        toast.error(generateErrorMessage(errorTypes.DATA, orderTypes.VOLUME, id));
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
      const success = (volume) => ({ type: volumesActionsTypes.CREATE_VOLUME_SUCCESS, volume, member: body.member });
      const failure = (error) => ({ type: volumesActionsTypes.CREATE_VOLUME_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        volume => resolve(dispatch(success(volume.data.id)))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.CREATE, orderTypes.VOLUME));
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
        toast.error(generateErrorMessage(errorTypes.DELETE, orderTypes.VOLUME, id));
        return reject(dispatch(failure(error)));
      });
    });
  };
};
