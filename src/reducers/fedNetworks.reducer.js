import { networksActionsTypes } from '../actions/networks.actions.types';

const fedNetworks = (state = {loading: false, data: []}, action) => {
    switch (action.type) {
        // GET ALL
        case networksActionsTypes.GET_FED_NETWORKS_REQUEST:
            return { loading: false };
        case networksActionsTypes.GET_FED_NETWORKS_SUCCESS:
            return {
                data: action.networks,
                loading: true
            };
        case networksActionsTypes.GET_FED_NETWORKS_FAILURE:
            return { error: action.error };
        
        // CREATE
        case networksActionsTypes.CREATE_FED_NETWORK_REQUEST:
            return { data: state.data, loading: false };
        case networksActionsTypes.CREATE_FED_NETWORK_SUCCESS:
            state.data.push({
                instanceId: action.network,
                state: 'OPEN',
                provider: action.member
            });
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case networksActionsTypes.CREATE_FED_NETWORK_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default fedNetworks;