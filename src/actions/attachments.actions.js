import { attachmentsActionsTypes } from './attachments.actions.types';
import AttachmentsProvider from '../providers/attachments.provider';
import ResourceActions from './common.actions';

export const getAttachments = () => {
  let provider = new AttachmentsProvider();
  const request = () => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_REQUEST });
  const success = (attachments) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_SUCCESS, attachments });
  const failure = (error) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.listAll(dispatch, provider, actionTypes);
};

export const getAttachmentData = (id) => {
  let provider = new AttachmentsProvider();
  const request = () => ({ type: attachmentsActionsTypes.GET_DATA_ATTACHEMENTS_REQUEST });
  const success = (attachments) => ({ type: attachmentsActionsTypes.GET_DATA_ATTACHEMENTS_SUCCESS, attachments });
  const failure = (error) => ({ type: attachmentsActionsTypes.GET_ATTACHEMENTS_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.get(id, dispatch, provider, actionTypes);
};

export const createAttachment = (body) => {
  let provider = new AttachmentsProvider();
  const request = () => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_REQUEST});
  const success = (attachment) => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_SUCCESS, attachment });
  const failure = (error) => ({ type: attachmentsActionsTypes.CREATE_ATTACHEMENT_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.create(body, dispatch, provider, actionTypes);
};

export const deleteAttachment = (id) => {
  let provider = new AttachmentsProvider();
  const request = () => ({ type: attachmentsActionsTypes.DELETE_ATTACHEMENT_REQUEST});
  const success = () => ({ type: attachmentsActionsTypes.DELETE_ATTACHEMENT_SUCCESS, id });
  const failure = (error) => ({ type: attachmentsActionsTypes.DELETE_ATTACHEMENT_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.delete(id, dispatch, provider, actionTypes);
};
