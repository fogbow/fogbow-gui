import { volumesActionsTypes } from '../actions/volumes.actions.types';

const volumes = (state = {loading: false, data: []}, action) => {
    switch (action.type) {
        // GET ALL
        case volumesActionsTypes.GET_VOLUMES_REQUEST:
            return { ...state, loading: false };
        case volumesActionsTypes.GET_VOLUMES_SUCCESS:
            return {
                ...state,
                data: action.volumes,
                loading: true
            };
        case volumesActionsTypes.GET_VOLUMES_FAILURE:
            return { ...state, error: action.error };
        
        // CREATE
        case volumesActionsTypes.CREATE_VOLUME_REQUEST:
            return { ...state, loading: false };
        case volumesActionsTypes.CREATE_VOLUME_SUCCESS:
            state.data.push({
                instanceId: action.volume,
                state: 'OPEN',
                provider: action.provider
            });
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case volumesActionsTypes.CREATE_VOLUME_FAILURE:
            return { ...state, error: action.error };

        // DELETE
        case volumesActionsTypes.DELETE_VOLUME_REQUEST:
            return { ...state };
        case volumesActionsTypes.DELETE_VOLUME_SUCCESS:
            return {
                ...state,
                data: state.data.filter(volume => volume.instanceId !== action.id),
                loading: true
            };
        case volumesActionsTypes.DELETE_VOLUME_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default volumes;