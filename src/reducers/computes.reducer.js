import { computesActionsTypes } from '../actions/computes.actions.types';

const computes = (state = { data: [], loading: false }, action) => {
    switch (action.type) {
        // GET ALL
        case computesActionsTypes.GET_COMPUTES_REQUEST:
            return { ...state, loading: false };
        case computesActionsTypes.GET_COMPUTES_SUCCESS:
            return {
                data: action.computes,
                loading: true
            };
        case computesActionsTypes.GET_COMPUTES_FAILURE:
            return { ...state, error: action.error };

        // CREATE
        case computesActionsTypes.CREATE_COMPUTE_REQUEST:
            return { ...state, loading: false };
        case computesActionsTypes.CREATE_COMPUTE_SUCCESS:
            state.data.push({
                instanceId: action.compute,
                state: 'OPEN',
                provider: action.provider
            });
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case computesActionsTypes.CREATE_COMPUTE_FAILURE:
            return { ...state, error: action.error };

        // DELETE
        case computesActionsTypes.DELETE_COMPUTE_REQUEST:
            return { ...state };
        case computesActionsTypes.DELETE_COMPUTE_SUCCESS:
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case computesActionsTypes.DELETE_COMPUTE_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default computes;