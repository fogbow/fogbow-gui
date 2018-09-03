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

export const createNetwork = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: networksActionsTypes.CREATE_NETWORK_REQUEST});
            const success = (network) => ({ type: networksActionsTypes.CREATE_NETWORK_SUCCESS, network, member: body.member });
            const failure = (error) => ({ type: networksActionsTypes.CREATE_NETWORK_FAILURE, error });

            dispatch(request());

            NetworksProvider.create(body).then(
                network => resolve(dispatch(success(network.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getFedNetworks = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: networksActionsTypes.GET_FED_NETWORKS_REQUEST});
            const success = (networks) => ({ type: networksActionsTypes.GET_FED_NETWORKS_SUCCESS, networks });
            const failure = (error) => ({ type: networksActionsTypes.GET_FED_NETWORKS_FAILURE, error });

            dispatch(request());

            NetworksProvider.getFetNets().then(
                network => resolve(dispatch(success(network.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const createFedNetwork = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: networksActionsTypes.CREATE_FED_NETWORK_REQUEST});
            const success = (network) => ({ type: networksActionsTypes.CREATE_FED_NETWORK_SUCCESS, network });
            const failure = (error) => ({ type: networksActionsTypes.CREATE_FED_NETWORK_FAILURE, error });

            dispatch(request());

            NetworksProvider.createFedNet(body).then(
                network => resolve(dispatch(success(network.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};