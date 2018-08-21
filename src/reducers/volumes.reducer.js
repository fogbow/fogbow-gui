import { volumesActionsTypes } from '../actions/volumes.actions.types';

const volumes = (state = {loading: false}, action) => {
    switch (action.type) {
        case volumesActionsTypes.GET_VOLUMES_REQUEST:
            return { loading: false };
        case volumesActionsTypes.GET_VOLUMES_SUCCESS:
            return {
                data: action.volumes,
                loading: true
            };
        case volumesActionsTypes.GET_VOLUMES_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default volumes;