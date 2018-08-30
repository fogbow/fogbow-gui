import { computesActionsTypes } from '../actions/computes.actions.types';

const computes = (state = { data: [], loading: false }, action) => {
    switch (action.type) {
        // GET ALL
        case computesActionsTypes.GET_COMPUTES_REQUEST:
            return { loading: false };
        case computesActionsTypes.GET_COMPUTES_SUCCESS:
            return {
                data: action.computes,
                loading: true
            };
        case computesActionsTypes.GET_COMPUTES_FAILURE:
            return { error: action.error };

        // CREATE
        case computesActionsTypes.CREATE_COMPUTE_REQUEST:
            return { loading: false };
        case computesActionsTypes.CREATE_COMPUTE_SUCCESS:
            return {
                ...state,
                data: state.data.push(action.compute),
                loading: true
            };
        case computesActionsTypes.CREATE_COMPUTE_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default computes;