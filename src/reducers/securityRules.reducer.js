import { networksActionsTypes } from '../actions/networks.actions.types';
import { publicIpsActionsTypes } from '../actions/publicIps.actions.types';

const securityRules = (state = {loading: false, data: []}, action) => {
  switch (action.type) {
    // CREATE NETWORK SECURITY RULES
    case networksActionsTypes.CREATE_NETWORK_SECURITY_RULE_REQUEST:
      return { data: state.data, loading: false };
    case networksActionsTypes.CREATE_NETWORK_SECURITY_RULE_SUCCESS:
      state.data.push({
          instanceId: action.securityRule,
          state: 'OPEN',
          provider: action.provider
      });
      return {
          ...state,
          data: state.data,
          loading: true
      };
    case networksActionsTypes.CREATE_NETWORK_SECURITY_RULE_FAILURE:
      return { ...state, error: action.error };

    // GET NETWORK SECURITY RULES
    case networksActionsTypes.GET_NETWORK_SECURITY_RULES_REQUEST:
      return { ...state, loading: false };
    case networksActionsTypes.GET_NETWORK_SECURITY_RULES_SUCCESS:
      return {
          ...state,
          data: action.securityRules,
          loading: true
      };
    case networksActionsTypes.GET_NETWORK_SECURITY_RULES_FAILURE:
      return { ...state, error: action.error };

    // DELETE NETWORK SECURITY RULES
    case networksActionsTypes.DELETE_NETWORK_SECURITY_RULE_REQUEST:
      return { ...state };
    case networksActionsTypes.DELETE_NETWORK_SECURITY_RULE_SUCCESS:
      return {
          ...state,
          data: state.data.filter(securityRule => securityRule.instanceId !== action.ruleId),
          loading: true
      };
    case networksActionsTypes.DELETE_NETWORK_SECURITY_RULE_FAILURE:
      return { ...state, error: action.error };

    // CREATE PUBLIC IP SECURITY RULE
    case publicIpsActionsTypes.CREATE_PUBLIC_IP_SECURITY_RULES_REQUEST:
      return { ...state, loading: false };
    case publicIpsActionsTypes.CREATE_PUBLIC_IP_SECURITY_RULES_SUCCESS:
      state.data.push({
          instanceId: action.securityRule,
          state: 'OPEN',
          provider: action.provider
      });
      return {
          ...state,
          data: state.data,
          loading: true
      };
    case publicIpsActionsTypes.CREATE_PUBLIC_IP_SECURITY_RULES_FAILURE:
      return { ...state, error: action.error };

    // GET PUBLIC IP SECURITY RULES
    case publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_RULES_REQUEST:
      return { ...state, loading: false };
    case publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_RULES_SUCCESS:
      return {
          ...state,
          data: action.securityRules,
          loading: true
      };
    case publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_RULES_FAILURE:
      return { ...state, error: action.error };

    // DELETE PUBLIC IP SECURITY RULE
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_RULE_REQUEST:
      return { ...state };
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_RULE_SUCCESS:
      return {
          ...state,
          data: state.data.filter(securityRule => securityRule.instanceId !== action.ruleId),
          loading: true
      };
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_RULE_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default securityRules;
