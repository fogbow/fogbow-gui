import { toast } from 'react-toastify';

import { publicIpsActionsTypes } from './publicIps.actions.types';
import PublicIPsProvider from '../providers/public.ips.provider';

export const createPublicIp = (body) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_REQUEST});
      const success = (publicIp) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SUCCESS, publicIp, member: body.provider });
      const failure = (error) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        publicIp => resolve(dispatch(success(publicIp.data)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to create public IP order.' + message + '.');
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
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to get public IP orders list.' + message + '.');
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
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to get details for public IP order: ' + id + '. ' + message + '.');
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
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to delete public IP order: ' + id + '. ' + message + '.');
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getPublicIpSecurityGroupRules = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_GROUP_RULES_REQUEST});
      const success = (securityGroupRules) => ({
        type: publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_GROUP_RULES_SUCCESS,
        securityGroupRules: securityGroupRules
      });
      const failure = (error) => ({
        type: publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_GROUP_RULES_FAILURE,
        error: error
      });

      dispatch(request());

      provider.getSecurityGroupRules(id).then(
        securityGroupRules => resolve(dispatch(success(securityGroupRules.data)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to get security group rules for public IP order: ' + id + '. ' + message + '.');
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deletePublicIpSecurityGroupRule = (ruleId, orderId) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new PublicIPsProvider();
      const request = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_GROUP_RULE_REQUEST});
      const success = () => ({
        type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_GROUP_RULE_SUCCESS,
        ruleId: ruleId
      });
      const failure = (error) => ({
        type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_GROUP_RULE_FAILURE,
        error: error
      });

      dispatch(request());

      provider.deleteSecurityGroupRule(ruleId, orderId).then(
        () => resolve(dispatch(success()))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to delete security group rule: ' + ruleId + ' for public IP order: ' +
                    orderId + '. ' + message + '.');
        return reject(dispatch(failure(error)));
      });
    });
  };
};
