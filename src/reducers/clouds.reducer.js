import { cloudsActionsTypes } from '../actions/clouds.actions.types';

const clouds = (state = {loading: false, data: []}, action) => {
  switch (action.type) {
    case cloudsActionsTypes.GET_LOCAL_CLOUDS_REQUEST:
        return { ...state, loading: false };
    case cloudsActionsTypes.GET_LOCAL_CLOUDS_SUCCESS:
        return {
            ...state,
            data: action.clouds,
            loading: true
        };
    case cloudsActionsTypes.GET_LOCAL_CLOUDS_FAILURE:
        return { ...state, error: action.error };

    case cloudsActionsTypes.GET_PROVIDER_CLOUDS_REQUEST:
        return { ...state, loading: false };
    case cloudsActionsTypes.GET_PROVIDER_CLOUDS_SUCCESS:
        return {
            ...state,
            data: action.clouds,
            loading: true
        };
    case cloudsActionsTypes.GET_PROVIDER_CLOUDS_FAILURE:
        return { ...state, error: action.error };

    default:
        return state;
  }
};

export default clouds;
