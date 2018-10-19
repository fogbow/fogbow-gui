import { env } from '../defaults/api.config';

export const messages = {
  auth: {
    error: ('Authentication failed. Please, check your credentials/configuration for the ' +
            'service ' + env.authenticationPlugin)
  },
  members: {
    error: ('Unable to retrieve federation members list. Please, check your membership service ' +
            'configuration.')
  },
  quota: {
    error: ('Unable to retrieve quota data. Your quota page might be outdated. ' +
            'Please, check your console log for further details.')
  },
  compute: {
    getComputes: {
      error: ('Unable to get compute orders data.')
    }
  }
};
