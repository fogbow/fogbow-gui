import { computesActionsTypes } from './computes.actions.types';
import ComputesProvider from '../providers/computes.provider';

export const getComputes = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: computesActionsTypes.GET_COMPUTES_REQUEST});
            const success = (computes) => ({ type: computesActionsTypes.GET_COMPUTES_SUCCESS, computes });
            const failure = (error) => ({ type: computesActionsTypes.GET_COMPUTES_FAILURE, error });

            dispatch(request());

            ComputesProvider.get().then(
                computes => resolve(dispatch(success(computes.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getImages = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: computesActionsTypes.GET_IMAGES_REQUEST});
            const success = (images) => ({ type: computesActionsTypes.GET_IMAGES_SUCCESS, images });
            const failure = (error) => ({ type: computesActionsTypes.GET_IMAGES_FAILURE, error });

            dispatch(request());

            ComputesProvider.getImages().then(
                images => resolve(dispatch(success(images.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const createCompute = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: computesActionsTypes.CREATE_COMPUTE_REQUEST});
            const success = (compute) => ({ type: computesActionsTypes.CREATE_COMPUTE_SUCCESS, compute });
            const failure = (error) => ({ type: computesActionsTypes.CREATE_COMPUTE_FAILURE, error });

            dispatch(request());

            ComputesProvider.create(body).then(
                images => resolve(dispatch(success(images.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};