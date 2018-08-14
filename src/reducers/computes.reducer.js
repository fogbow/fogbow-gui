import { computesActionsTypes } from '../actions/computes.actions.types';

const computes = (state = {loading: false}, action) => {
    switch (action.type) {
        case computesActionsTypes.GET_MEMBERS_REQUEST:
            return { loading: false };
        case computesActionsTypes.GET_MEMBERS_SUCCESS:
            return {
                data: action.computes,
                loading: true
            };
        case computesActionsTypes.GET_MEMBERS_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default computes;