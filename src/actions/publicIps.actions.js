import { toast } from 'react-toastify';

import { messages, getErrorMessage } from '../defaults/messages';
import { publicIpsActionsTypes } from './publicIps.actions.types';
import PublicIPsProvider from '../providers/public.ips.provider';
import ResourceActions from './common.actions';

export const getAllPublicIpAllocation = (providerId, cloudNames) => {
  let resourceProvider = new PublicIPsProvider();
  const request = () => ({ type: publicIpsActionsTypes.GET_ALL_PUBLIC_IP_ALLOCATION_REQUEST});
  const success = (allocations) => ({ type: publicIpsActionsTypes.GET_ALL_PUBLIC_IP_ALLOCATION_SUCCESS, allocations });
  const failure = (error) => ({ type: publicIpsActionsTypes.GET_ALL_PUBLIC_IP_ALLOCATION_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.getAllocations(providerId, cloudNames, dispatch, resourceProvider, actionTypes);
};

export const getPublicIpAllocation = (providerId, cloudName) => {
  let resourceProvider = new PublicIPsProvider();
  const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_ALLOCATION_REQUEST});
  const success = (allocation) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_ALLOCATION_SUCCESS, allocation });
  const failure = (error) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IP_ALLOCATION_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.getAllocation(providerId, cloudName, dispatch, resourceProvider, actionTypes);
};

export const createPublicIp = (body) => {
  let provider = new PublicIPsProvider();
  const request = () => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_REQUEST});
  const success = (publicIp) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_SUCCESS, publicIp, provider: body.provider });
  const failure = (error) => ({ type: publicIpsActionsTypes.CREATE_PUBLIC_IP_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.create(body, dispatch, provider, actionTypes);
};

export const getPublicIps = () => {
  let provider = new PublicIPsProvider();
  const request = () => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_REQUEST});
  const success = (publicIps) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_SUCCESS, publicIps });
  const failure = (error) => ({ type: publicIpsActionsTypes.GET_PUBLIC_IPS_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.listAll(dispatch, provider, actionTypes);
};

export const getPublicIpData = (id) => {
  let provider = new PublicIPsProvider();
  const request = () => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_REQUEST});
  const success = (publicIp) => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_SUCCESS, publicIp });
  const failure = (error) => ({ type: publicIpsActionsTypes.GET_DATA_PUBLIC_IP_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.get(id, dispatch, provider, actionTypes);
};

export const deletePublicIp = (id) => {
  let provider = new PublicIPsProvider();
  const request = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_REQUEST});
  const success = () => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_SUCCESS, id });
  const failure = (error) => ({ type: publicIpsActionsTypes.DELETE_PUBLIC_IP_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.delete(id, dispatch, provider, actionTypes);
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
