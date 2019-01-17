import { cloudsActionsTypes } from '../actions/clouds.actions.types';

const remoteClouds = (state = {loading: false}, action) => {
  switch (action.type) {
    case cloudsActionsTypes.GET_REMOTE_CLOUDS_REQUEST:
      return { loading: false };
    case cloudsActionsTypes.GET_REMOTE_CLOUDS_SUCCESS:
      return {
        data: action.clouds,
        loading: true
      };
    case cloudsActionsTypes.GET_REMOTE_CLOUDS_FAILURE:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default remoteClouds;
