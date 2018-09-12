import { membersActionsTypes } from '../actions/members.actions.types';

const members = (state = {loading: false, specific: {}}, action) => {
    switch (action.type) {
        case membersActionsTypes.GET_MEMBERS_REQUEST:
            return { ...state, loading: false };
        case membersActionsTypes.GET_MEMBERS_SUCCESS:
            return {
                ...state,
                data: action.members,
                loading: true
            };
        case membersActionsTypes.GET_MEMBERS_FAILURE:
            return { ...state, error: action.error };

        case membersActionsTypes.GET_MEMBER_DATA_REQUEST:
            return { ...state, loadingMember: false };
        case membersActionsTypes.GET_MEMBER_DATA_SUCCESS:
            let specific = state.specific;
            specific[action.id] = action.quota;
            return {
                ...state,
                specific,
                loadingMember: true
            };
        case membersActionsTypes.GET_MEMBER_DATA_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default members;