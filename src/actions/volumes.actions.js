import { volumesActionsTypes } from './volumes.actions.types';
import VolumesProvider from '../providers/volumes.provider';

export const getVolumes = () => {
    return async(dispatch) => {
        const request = () => ({ type: volumesActionsTypes.GET_VOLUMES_REQUEST});
        const success = (volumes) => ({ type: volumesActionsTypes.GET_VOLUMES_SUCCESS, volumes });
        const failure = (error) => ({ type: volumesActionsTypes.GET_VOLUMES_FAILURE, error });
        try {
            dispatch(request());
            let volumes = await VolumesProvider.get();

            dispatch(success(volumes.data));
        } catch (error) {
            dispatch(failure(error))
        }
    };
};

export const getVolumeData = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: volumesActionsTypes.GET_DATA_VOLUME_REQUEST});
            const success = (volume) => ({ type: volumesActionsTypes.GET_DATA_VOLUME_SUCCESS, volume });
            const failure = (error) => ({ type: volumesActionsTypes.GET_DATA_VOLUME_FAILURE, error });

            dispatch(request());

            VolumesProvider.getData(id).then(
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

export const deleteVolume = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: volumesActionsTypes.DELETE_VOLUME_REQUEST});
            const success = () => ({ type: volumesActionsTypes.DELETE_VOLUME_SUCCESS, id });
            const failure = (error) => ({ type: volumesActionsTypes.DELETE_VOLUME_FAILURE, error });

            dispatch(request());

            VolumesProvider.delete(id).then(
                () => resolve(dispatch(success()))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};