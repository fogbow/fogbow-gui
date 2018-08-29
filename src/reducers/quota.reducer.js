import { membersActionsTypes } from '../actions/members.actions.types';

const members = (state = {loading: false}, action) => {
    switch (action.type) {
        case membersActionsTypes.GET_MEMBER_DATA_REQUEST:
            return { data: [] };
        case membersActionsTypes.GET_MEMBER_DATA_SUCCESS:
            let data = {};
            data[action.id] = action.quota;
            return {
                data: data
            };
        case membersActionsTypes.GET_MEMBERS_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default members;