import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { authActionsTypes } from './auth.actions.types';
import AuthProvider from '../providers/auth.provider';

export const getAuthorization = (credentials) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const request = () => ({ type: authActionsTypes.GET_AUTH_REQUEST });
      const success = (token) => ({ type: authActionsTypes.GET_AUTH_SUCCESS, token });
      const failure = (error) => ({ type: authActionsTypes.GET_AUTH_FAILURE, error });

      dispatch(request());

      AuthProvider.authorize(credentials).then(
        auth => resolve(dispatch(success(auth.data.token)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.auth.login.concat(message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getServerPublicKey = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const request = () => ({ type: authActionsTypes.GET_SERVER_PUBLIC_KEY_REQUEST });
      const success = (token) => ({ type: authActionsTypes.GET_SERVER_PUBLIC_KEY_SUCCESS, token });
      const failure = (error) => ({ type: authActionsTypes.GET_SERVER_PUBLIC_KEY_FAILURE, error });

      dispatch(request());

      AuthProvider.getServerPublicKey().then(
        publicKey => resolve(dispatch(success(publicKey.data.publicKey)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.auth.publicKey.concat(message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};
