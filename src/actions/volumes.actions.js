import { volumesActionsTypes } from './volumes.actions.types';
import VolumesProvider from '../providers/volumes.provider';

export const getVolumes = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: volumesActionsTypes.GET_VOLUMES_REQUEST});
            const success = (volumes) => ({ type: volumesActionsTypes.GET_VOLUMES_SUCCESS, volumes });
            const failure = (error) => ({ type: volumesActionsTypes.GET_VOLUMES_FAILURE, error });

            dispatch(request());

            VolumesProvider.get().then(
                volumes => resolve(dispatch(success(volumes.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const createVolume = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: volumesActionsTypes.CREATE_VOLUME_REQUEST});
            const success = (volume) => ({ type: volumesActionsTypes.CREATE_VOLUME_SUCCESS, volume, member: body.member });
            const failure = (error) => ({ type: volumesActionsTypes.CREATE_VOLUME_FAILURE, error });

            dispatch(request());

            VolumesProvider.create(body).then(
                volume => resolve(dispatch(success(volume.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};