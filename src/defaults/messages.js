import { env } from '../defaults/api.config';

export const errorTypes = {
  GET: 'GET',
  DATA: 'DATA',
  CREATE: 'CREATE',
  DELETE: 'DELETE'
};

export const orderTypes = {
  ATTACHMENT: 'attachment',
  COMPUTE: 'compute',
  FEDERATED_NETWORK: 'federated network',
  NETWORK: 'network',
  PUBLIC_IP: 'public IP',
  VOLUME: 'volume',
};

export const messages = {
  auth: {
    error: ('Authentication failed. Please, check your credentials/configuration for the ' +
            'service ' + env.authenticationPlugin)
  },
  members: {
    error: ('Unable to retrieve federation members list. Please, check your membership service ' +
            'configuration.')
  },
  version: {
    error: 'Unable to retrieve API versions.'
  },
  quota: {
    error: ('Unable to retrieve quota data. Your quota page might be outdated. ' +
            'Please, check your console log for further details.')
  },
  getImages: {
    error: 'Unable to retrieve images list from local provider.'
  },
  getRemoteImages: {
    error: 'Unable to retrieve images list from remote providers.'
  },
};

export const quotaErrorMessage = (memberId) => {
  return ('Unable to retrieve quota data for member: ' + memberId + '. Aggregated quota values ' +
          'might be outated. Please, check your console log for further details.');
};

export const generateErrorMessage = (errorType, orderType, orderId) => {
  return error => {
    let errorMessage = '';

    switch(errorType) {
      case errorTypes.GET:
        errorMessage = 'Unable to retrieve ' + orderType + ' orders list.';
        break;
      case errorTypes.DATA:
        errorMessage = 'Unable to retrieve details from ' +  orderType + ' order: ' + orderId;
        break;
      case errorTypes.CREATE:
        errorMessage = ('Unable to create ' + orderType + ' order. Please, check whether the ' +
                        'form is properly filled.');
        break;
      case errorTypes.DELETE:
        errorMessage = 'Unable to delete ' + orderType + ' order: ' + orderId;
        break;
      default:
        errorMessage = 'An error occurred. Please, check your console log for further info.';
        break;
    }

    return errorMessage;
  };
};
