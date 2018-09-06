import { attachmentsActionsTypes } from '../actions/attachments.actions.types';

const attachments = (state = {loading: false}, action) => {
    switch (action.type) {
        // GET ALL
        case attachmentsActionsTypes.GET_ATTACHEMENTS_REQUEST:
            return { ...state, loading: false };
        case attachmentsActionsTypes.GET_ATTACHEMENTS_SUCCESS:
            return {
                data: action.attachments,
                loading: true
            };
        case attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE:
            return { error: action.error };

        // CREATE
        case attachmentsActionsTypes.CREATE_ATTACHEMENT_REQUEST:
            return { ...state, loading: false };
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

        
        // DELETE
        case attachmentsActionsTypes.DELETE_ATTACHEMENT_REQUEST:
            return { ...state };
        case attachmentsActionsTypes.DELETE_ATTACHEMENT_SUCCESS:
            return {
                ...state,
                data: state.data.filter(compute => compute.instanceId !== action.id),
                loading: true
            };
        case attachmentsActionsTypes.DELETE_ATTACHEMENT_FAILURE:
            return { error: action.error };
        
        default:
            return state;
    }
};

export default attachments;