import { toast } from 'react-toastify';

import { messages } from '../defaults/messages';
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
        auth => resolve(dispatch(success(auth.data)))
      ).catch((error) => {
        toast.error(messages.auth.error);
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getFnsPublicKey = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const request = () => ({ type: authActionsTypes.GET_FNS_PUBLIC_KEY_REQUEST });
      const success = (token) => ({ type: authActionsTypes.GET_FNS_PUBLIC_KEY_SUCCESS, token });
      const failure = (error) => ({ type: authActionsTypes.GET_FNS_PUBLIC_KEY_FAILURE, error });

      dispatch(request());

      AuthProvider.getFnsPublicKey().then(
        publicKey => resolve(dispatch(success(publicKey.data)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to retrieve public key from FNS service. ' + message + '.');
        return reject(dispatch(failure(error)))
      });
    });
  };
};
