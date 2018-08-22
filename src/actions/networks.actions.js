import { networksActionsTypes } from './networks.actions.types';
import NetworksProvider from '../providers/networks.provider';

export const getNetworks = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: networksActionsTypes.GET_NETWORKS_REQUEST});
            const success = (networks) => ({ type: networksActionsTypes.GET_NETWORKS_SUCCESS, networks });
            const failure = (error) => ({ type: networksActionsTypes.GET_NETWORKS_FAILURE, error });

            dispatch(request());

            NetworksProvider.get().then(
                network => resolve(dispatch(success(network.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};