import { membersActionsTypes } from '../actions/members.actions.types';

const members = (state = {loading: false}, action) => {
    switch (action.type) {
        case membersActionsTypes.GET_MEMBERS_REQUEST:
            return { loading: false };
        case membersActionsTypes.GET_MEMBERS_SUCCESS:
            return {
                data: action.members,
                loading: true
            };
        case membersActionsTypes.GET_MEMBERS_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default members;