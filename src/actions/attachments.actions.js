import { attachmentsActionsTypes } from './attachments.actions.types';
import AttachmentsProvider from '../providers/attachments.provider';

export const getAttachments = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_REQUEST });
            const success = (attachments) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_SUCCESS, attachments });
            const failure = (error) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE, error });

            dispatch(request());

            AttachmentsProvider.get().then(
                attachments => resolve(dispatch(success(attachments.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};