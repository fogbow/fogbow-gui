import { providersActionsTypes } from '../actions/providers.actions.types';

const providers = (state = {loading: false, specific: {}}, action) => {
  switch (action.type) {
    case providersActionsTypes.GET_PROVIDERS_REQUEST:
        return { ...state, loading: false };
    case providersActionsTypes.GET_PROVIDERS_SUCCESS:
        return {
            ...state,
            data: action.providers,
            loading: true
        };
    case providersActionsTypes.GET_PROVIDERS_FAILURE:
        return { ...state, error: action.error };

    case providersActionsTypes.GET_PROVIDER_DATA_REQUEST:
        return { ...state, loadingProvider: false };
    case providersActionsTypes.GET_PROVIDER_DATA_SUCCESS:
        let specific = state.specific;
        specific[action.id] = action.quota;
        return {
            ...state,
            specific,
            loadingProvider: true
        };
    case providersActionsTypes.GET_PROVIDER_DATA_FAILURE:
        return { ...state, error: action.error };

    default:
        return state;
  }
};

export default providers;
