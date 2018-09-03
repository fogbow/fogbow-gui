import { volumesActionsTypes } from '../actions/volumes.actions.types';

const volumes = (state = {loading: false, data: []}, action) => {
    switch (action.type) {
        // GET ALL
        case volumesActionsTypes.GET_VOLUMES_REQUEST:
            return { loading: false };
        case volumesActionsTypes.GET_VOLUMES_SUCCESS:
            return {
                data: action.volumes,
                loading: true
            };
        case volumesActionsTypes.GET_VOLUMES_FAILURE:
            return { error: action.error };
        
        // CREATE
        case volumesActionsTypes.CREATE_VOLUME_REQUEST:
            return { data: state.data, loading: false };
        case volumesActionsTypes.CREATE_VOLUME_SUCCESS:
            state.data.push({
                instanceId: action.volume,
                state: 'OPEN',
                provider: action.member
            });
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case volumesActionsTypes.CREATE_VOLUME_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default volumes;