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