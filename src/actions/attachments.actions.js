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

export const createAttachment = (body) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_REQUEST});
            const success = (attachment) => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_SUCCESS, attachment });
            const failure = (error) => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_FAILURE, error });

            dispatch(request());

            AttachmentsProvider.create(body).then(
                attachment => resolve(dispatch(success(attachment.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};