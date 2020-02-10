import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { publicIpsActionsTypes } from './publicIps.actions.types';
import PublicIPsProvider from '../providers/public.ips.provider';

export const getPublicIpAllocation = (providerId, cloudName) => {
  return dispatch => {
    return new Promise(async(resolve, reject) => {
      let resourceProvider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_ALLOCATION_REQUEST});
      const success = (allocation) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_ALLOCATION_SUCCESS, allocation });
      const failure = (error) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_ALLOCATION_FAILURE, error });
    
      dispatch(request());
      try {
          try {
            let allocation = await resourceProvider.getAllocation(providerId, cloudName);
            resolve(dispatch(success(allocation.data)));
          } catch (error) {
            console.err(error);
            throw error;
          }
      } catch (error) {
        // const message = getErrorMessage(error);
        // toast.error(messages.allocations.get.concat(message));
        reject(dispatch(failure(error)));
      }
    });
  };
};

export const createPublicIp = (body) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_REQUEST});
      const success = (publicIp) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SUCCESS, publicIp, provider: body.provider });
      const failure = (error) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        publicIp => resolve(dispatch(success(publicIp.data.id)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.create.concat(message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getPublicIps = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_REQUEST});
      const success = (publicIps) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_SUCCESS, publicIps });
      const failure = (error) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_FAILURE, error });

      dispatch(request());

      provider.get().then(
        publicIps => resolve(dispatch(success(publicIps.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.getStatus.concat(message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getPublicIpData = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_REQUEST});
      const success = (publicIp) => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_SUCCESS, publicIp });
      const failure = (error) => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_FAILURE, error });

      dispatch(request());

      provider.getData(id).then(
        publicIp => resolve(dispatch(success(publicIp.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.orders.get.concat(id, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deletePublicIp = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_REQUEST});
      const success = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SUCCESS, id });
      const failure = (error) => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_FAILURE, error });

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

export const createPublicIpSecurityRule = (body, id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SECURITY_RULES_REQUEST});
      const success = (securityRule) => ({
        type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SECURITY_RULES_SUCCESS,
        securityRule,
        provider: body.provider
      });
      const failure = (error) => ({
        type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SECURITY_RULES_FAILURE,
        error
      });

      dispatch(request());

      provider.createSecurityRule(body, id).then(
        securityRule => resolve(dispatch(success(securityRule.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.securityRules.create.concat(message));
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getPublicIpSecurityRules = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_RULES_REQUEST});
      const success = (securityRules) => ({
        type: publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_RULES_SUCCESS,
        securityRules: securityRules
      });
      const failure = (error) => ({
        type: publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_RULES_FAILURE,
        error: error
      });

      dispatch(request());

      provider.getSecurityRules(id).then(
        securityRules => resolve(dispatch(success(securityRules.data)))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.securityRules.get.concat(id, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deletePublicIpSecurityRule = (ruleId, orderId) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_RULE_REQUEST});
      const success = () => ({
        type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_RULE_SUCCESS,
        ruleId: ruleId
      });
      const failure = (error) => ({
        type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_RULE_FAILURE,
        error: error
      });

      dispatch(request());

      provider.deleteSecurityRule(ruleId, orderId).then(
        () => resolve(dispatch(success()))
      ).catch((error) => {
        const message = getErrorMessage(error);
        toast.error(messages.securityRules.remove.concat(ruleId, message));
        return reject(dispatch(failure(error)));
      });
    });
  };
};
