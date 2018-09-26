import { floatIpsActionsTypes } from '../actions/floatIps.actions.types';

const floatIps = (state = {loading: false, specific: {}}, action) => {
    switch (action.type) {
        // GET
        case floatIpsActionsTypes.GET_FLOAT_IPS_REQUEST:
            return { ...state, loading: false };
        case floatIpsActionsTypes.GET_FLOAT_IPS_SUCCESS:
            return {
                ...state,
                data: action.floatIps,
                loading: true
            };
        case floatIpsActionsTypes.GET_FLOAT_IPS_FAILURE:
            return { ...state, error: action.error };

        // CREATE
        case floatIpsActionsTypes.CREATE_FLOAT_IP_REQUEST:
            return { ...state, loading: false };
        case floatIpsActionsTypes.CREATE_FLOAT_IP_SUCCESS:
            state.data.push({
                instanceId: action.floatIp,
                state: 'OPEN',
                provider: action.member
            });
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case floatIpsActionsTypes.CREATE_FLOAT_IP_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default floatIps;