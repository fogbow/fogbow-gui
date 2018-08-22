import { networksActionsTypes } from '../actions/networks.actions.types';

const networks = (state = {loading: false}, action) => {
    switch (action.type) {
        case networksActionsTypes.GET_NETWORKS_REQUEST:
            return { loading: false };
        case networksActionsTypes.GET_NETWORKS_SUCCESS:
            return {
                data: action.networks,
                loading: true
            };
        case networksActionsTypes.GET_NETWORKS_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default networks;