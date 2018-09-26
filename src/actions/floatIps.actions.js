import { floatIpsActionsTypes } from './floatIps.actions.types';
import FloatIPsProvider from '../providers/float.ips.provider';

export const createFloatIp = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new FloatIPsProvider();
            const request = () => ({ type: floatIpsActionsTypes.CREATE_FLOAT_IP_REQUEST});
            const success = (floatIp) => ({ type: floatIpsActionsTypes.CREATE_FLOAT_IP_SUCCESS, floatIp, member: body.providingMember });
            const failure = (error) => ({ type: floatIpsActionsTypes.CREATE_FLOAT_IP_FAILURE, error });

            dispatch(request());

            provider.create(body).then(
                floatIp => resolve(dispatch(success(floatIp.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getFloatIps = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new FloatIPsProvider();
            const request = () => ({ type: floatIpsActionsTypes.GET_FLOAT_IPS_REQUEST});
            const success = (floatIps) => ({ type: floatIpsActionsTypes.GET_FLOAT_IPS_SUCCESS, floatIps });
            const failure = (error) => ({ type: floatIpsActionsTypes.GET_FLOAT_IPS_FAILURE, error });

            dispatch(request());

            provider.get().then(
                floatIps => resolve(dispatch(success(floatIps.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getFloatIpData = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new FloatIPsProvider();
            const request = () => ({ type: floatIpsActionsTypes.GET_DATA_FLOAT_IP_REQUEST});
            const success = (volume) => ({ type: floatIpsActionsTypes.GET_DATA_FLOAT_IP_SUCCESS, volume });
            const failure = (error) => ({ type: floatIpsActionsTypes.GET_DATA_FLOAT_IP_FAILURE, error });

            dispatch(request());

            provider.getData(id).then(
                volumes => resolve(dispatch(success(volumes.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const deleteFloatIp = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new FloatIPsProvider();
            const request = () => ({ type: floatIpsActionsTypes.DELETE_FLOAT_IP_REQUEST});
            const success = () => ({ type: floatIpsActionsTypes.DELETE_FLOAT_IP_SUCCESS, id });
            const failure = (error) => ({ type: floatIpsActionsTypes.DELETE_FLOAT_IP_FAILURE, error });

            dispatch(request());

            provider.delete(id).then(
                () => resolve(dispatch(success()))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};