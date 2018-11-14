import { publicIpsActionsTypes } from '../actions/publicIps.actions.types';

const publicIps = (state = {loading: false, specific: {}}, action) => {
  switch (action.type) {
    // GET
    case publicIpsActionsTypes.GET_PUBLIC_IPS_REQUEST:
      return { ...state, loading: false };
    case publicIpsActionsTypes.GET_PUBLIC_IPS_SUCCESS:
      return {
          ...state,
          data: action.publicIps,
          loading: true
      };
    case publicIpsActionsTypes.GET_PUBLIC_IPS_FAILURE:
      return { ...state, error: action.error };

    // CREATE
    case publicIpsActionsTypes.CREATE_PUBLIC_IP_REQUEST:
      return { ...state, loading: false };
    case publicIpsActionsTypes.CREATE_PUBLIC_IP_SUCCESS:
      state.data.push({
          instanceId: action.publicIp,
          state: 'OPEN',
          provider: action.member
      });
      return {
          ...state,
          data: state.data,
          loading: true
      };
    case publicIpsActionsTypes.CREATE_PUBLIC_IP_FAILURE:
      return { ...state, error: action.error };

    // DELETE
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_REQUEST:
      return { ...state };
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SUCCESS:
      return {
          ...state,
          data: state.data.filter(publicIp => publicIp.instanceId !== action.id),
          loading: true
      };
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_FAILURE:
      return { ...state, error: action.error };

    // GET SECURITY GROUP RULES
    case publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_GROUP_RULES_REQUEST:
      return { ...state, loading: false };
    case publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_GROUP_RULES_SUCCESS:
      return {
          ...state,
          data: action.securityGroupRules,
          loading: true
      };
    case publicIpsActionsTypes.GET_PUBLIC_IP_SECURITY_GROUP_RULES_FAILURE:
      return { ...state, error: action.error };

    // DELETE SECURITY GROUP RULES
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_GROUP_RULE_REQUEST:
      return { ...state };
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_GROUP_RULE_SUCCESS:
      return {
          ...state,
          data: state.data.filter(securityGroupRule => securityGroupRule.instanceId !== action.ruleId),
          loading: true
      };
    case publicIpsActionsTypes.DELETE_PUBLIC_IP_SECURITY_GROUP_RULE_FAILURE:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default publicIps;
