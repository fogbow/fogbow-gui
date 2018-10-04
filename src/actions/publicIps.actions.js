import { publicIpsActionsTypes } from './publicIps.actions.types';
import PublicIPsProvider from '../providers/public.ips.provider';

export const createPublicIp = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new PublicIPsProvider();
            const request = () => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_REQUEST});
            const success = (publicIp) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SUCCESS, publicIp, member: body.providingMember });
            const failure = (error) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_FAILURE, error });

            dispatch(request());

            provider.create(body).then(
                publicIp => resolve(dispatch(success(publicIp.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getPublicIps = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new PublicIPsProvider();
            const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_REQUEST});
            const success = (publicIps) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_SUCCESS, publicIps });
            const failure = (error) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_FAILURE, error });

            dispatch(request());

            provider.get().then(
                publicIps => resolve(dispatch(success(publicIps.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getPublicIpData = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new PublicIPsProvider();
            const request = () => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_REQUEST});
            const success = (publicIp) => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_SUCCESS, publicIp });
            const failure = (error) => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_FAILURE, error });

            dispatch(request());

            provider.getData(id).then(
                publicIp => resolve(dispatch(success(publicIp.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const deletePublicIp = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new PublicIPsProvider();
            const request = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_REQUEST});
            const success = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SUCCESS, id });
            const failure = (error) => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_FAILURE, error });

            dispatch(request());

            provider.delete(id).then(
                () => resolve(dispatch(success()))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};