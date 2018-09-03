import { attachmentsActionsTypes } from '../actions/attachments.actions.types';

const attachments = (state = {loading: false}, action) => {
    switch (action.type) {
        // GET ALL
        case attachmentsActionsTypes.GET_ATTACHEMENTS_REQUEST:
            return { loading: false };
        case attachmentsActionsTypes.GET_ATTACHEMENTS_SUCCESS:
            return {
                data: action.attachments,
                loading: true
            };
        case attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE:
            return { error: action.error };

                // CREATE
        case attachmentsActionsTypes.CREATE_ATTACHEMENT_REQUEST:
            return { data: state.data, loading: false };
        case attachmentsActionsTypes.CREATE_ATTACHEMENT_SUCCESS:
            state.data.push({
                instanceId: action.attachment,
                state: 'OPEN',
            });
            return {
                ...state,
                data: state.data,
                loading: true
            };
        case attachmentsActionsTypes.CREATE_ATTACHEMENT_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default attachments;