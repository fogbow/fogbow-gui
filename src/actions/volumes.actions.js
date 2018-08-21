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