import { networksActionsTypes } from '../actions/networks.actions.types';

const networks = (state = {loading: false, data: []}, action) => {
    switch (action.type) {
        // GET ALL
        case networksActionsTypes.GET_NETWORKS_REQUEST:
            return { loading: false };
        case networksActionsTypes.GET_NETWORKS_SUCCESS:
            return {
                data: action.networks,
                loading: true
            };
        case networksActionsTypes.GET_NETWORKS_FAILURE:
            return { ...state, error: action.error };
        
        // CREATE
        case networksActionsTypes.CREATE_NETWORK_REQUEST:
            return { data: state.data, loading: false };
        case networksActionsTypes.CREATE_NETWORK_SUCCESS:
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
        case networksActionsTypes.CREATE_NETWORK_FAILURE:
            return { ...state, error: action.error };
        
        // DELETE
        case networksActionsTypes.DELETE_NETWORK_REQUEST:
            return { ...state };
        case networksActionsTypes.DELETE_NETWORK_SUCCESS:
            return {
                ...state,
                data: state.data.filter(network => network.instanceId !== action.id),
                loading: true
            };
        case networksActionsTypes.DELETE_NETWORK_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default networks;