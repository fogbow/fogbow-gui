export const messages = {
  common: {
    noResponse: 'Request was sent but the server returned no response',
    unknown: 'An error occurred. Try again later'
  },
  orders: {
    getStatus: 'Unable to retrieve orders',
    get: 'Unable to retrieve order ',
    create: 'Unable to create order',
    remove: 'Unable to delete order '
  },
  compute: {
    pause: 'Unable to pause compute ',
    hibernate: 'Unable to hibernate compute ',
  },
  auth: {
    login: 'Login failed',
    publicKey: 'Unable to retrieve SERVER public key'
  },
  clouds: {
    getLocal: 'Unable to retrieve local provider clouds list',
    getRemote: 'Unable to retrieve clouds list from provider ',
  },
  images: {
    get: 'Unable to retrieve images list'
  },
  providers: {
    get: 'Unable to retrieve providers list',
    getQuota: 'Unable to retrieve quota from provider ',
    getAllQuota: 'Unable to retrieve quota from all providers',
  },
  securityRules: {
    get: 'Unable to retrieve security rules for order ',
    create: 'Unable to create security rule',
    remove: 'Unable to delete security rule '
  },
  version: {
    get: 'Unable to retrieve version from service ',
  },
  allocations: {
    get: 'Unable to retrieve allocation from cloud ',
    getAll: 'Unable to retrieve allocation from all clouds'
  }
};

export const getErrorMessage = (error) => {
  let message = undefined;
  const messagePrefix = '. ';
  const messageSuffix = '.';

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    message = error.response.data.message;
  } else if (error.request) {
    // The request was made but no response was received;
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    message = messages.common.noResponse;
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message;
  }

  message = message ? message : messages.common.unknown;
  return messagePrefix.concat(message, messageSuffix);
};
