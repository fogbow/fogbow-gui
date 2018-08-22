import { attachmentsActionsTypes } from '../actions/attachments.actions.types';

const attachments = (state = {loading: false}, action) => {
    switch (action.type) {
        case attachmentsActionsTypes.GET_ATTACHEMENTS_REQUEST:
            return { loading: false };
        case attachmentsActionsTypes.GET_ATTACHEMENTS_SUCCESS:
            return {
                data: action.attachments,
                loading: true
            };
        case attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default attachments;