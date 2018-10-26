import { versionActionsTypes } from '../actions/version.actions.types';

const version = (state = {loading: false}, action) => {
  switch (action.type) {
    case versionActionsTypes.GET_VERSION_REQUEST:
      return { ...state, loading: false };
    case versionActionsTypes.GET_VERSION_SUCCESS:
      return {
          data: action.version,
          loading: true
      };
    case versionActionsTypes.GET_VERSION_FAILURE:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default version;
