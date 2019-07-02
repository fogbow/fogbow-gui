import { providersActionsTypes } from '../actions/providers.actions.types';

const providers = (state = {loading: false, data: []}, action) => {
    switch (action.type) {
        case providersActionsTypes.GET_PROVIDER_DATA_REQUEST:
            return { data: [] };
        case providersActionsTypes.GET_PROVIDER_DATA_SUCCESS:
            let data = {};
            data[action.id] = action.quota;
            return {
                data: data
            };
        case providersActionsTypes.GET_PROVIDERS_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default providers;