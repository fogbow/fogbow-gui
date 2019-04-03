import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { attachmentsActionsTypes } from './attachments.actions.types';
import AttachmentsProvider from '../providers/attachments.provider';

export const getAttachments = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new AttachmentsProvider();
      const request = () => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_REQUEST });
      const success = (attachments) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_SUCCESS, attachments });
      const failure = (error) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE, error });

      dispatch(request());

      provider.get().then(
        attachments => resolve(dispatch(success(attachments.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.getStatus.concat(message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getAttachmentData = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new AttachmentsProvider();
      const request = () => ({ type: attachmentsActionsTypes.GET_DATA_ATTACHEMENTS_REQUEST });
      const success = (attachments) => ({ type: attachmentsActionsTypes.GET_DATA_ATTACHEMENTS_SUCCESS, attachments });
      const failure = (error) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE, error });

      dispatch(request());

      provider.getData(id).then(
        attachments => resolve(dispatch(success(attachments.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.get.concat(id, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const createAttachment = (body) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new AttachmentsProvider();
      const request = () => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_REQUEST});
      const success = (attachment) => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_SUCCESS, attachment });
      const failure = (error) => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        attachment => resolve(dispatch(success(attachment.data.id)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.create.concat(message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deleteAttachment = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new AttachmentsProvider();
      const request = () => ({ type: attachmentsActionsTypes.DELETE_ATTACHEMENT_REQUEST});
      const success = () => ({ type: attachmentsActionsTypes.DELETE_ATTACHEMENT_SUCCESS, id });
      const failure = (error) => ({ type: attachmentsActionsTypes.DELETE_ATTACHEMENT_FAILURE, error });

      dispatch(request());

      provider.delete(id).then(
        () => resolve(dispatch(success()))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.remove.concat(id, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};
