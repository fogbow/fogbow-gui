import { toast } from 'react-toastify';

import { generateErrorMessage, errorTypes, orderTypes } from '../defaults/messages';
import { networksActionsTypes } from './networks.actions.types';
import NetworksProvider from '../providers/networks.provider';

export const getNetworks = () => {
  return async(dispatch) => {
    let provider = new NetworksProvider();
    const request = () => ({ type: networksActionsTypes.GET_NETWORKS_REQUEST});
    const success = (networks) => ({ type: networksActionsTypes.GET_NETWORKS_SUCCESS, networks });
    const failure = (error) => ({ type: networksActionsTypes.GET_NETWORKS_FAILURE, error });

    try {
      dispatch(request());
      let network = await provider.get();
      dispatch(success(network.data))
    } catch (error) {
      const message = error.response ? error.response.data.message : error.message;
      toast.error('Unable to create network order. ' + message + '.');
      dispatch(failure(error))
    }
  };
};

export const getNetworkData = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.GET_DATA_NETWORK_REQUEST});
      const success = (networks) => ({ type: networksActionsTypes.GET_DATA_NETWORK_SUCCESS, networks });
      const failure = (error) => ({ type: networksActionsTypes.GET_DATA_NETWORK_FAILURE, error });

      dispatch(request());

      provider.getData(id).then(
        network => resolve(dispatch(success(network.data)))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.DATA, orderTypes.NETWORK, id));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const createNetwork = (body) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.CREATE_NETWORK_REQUEST});
      const success = (network) => ({ type: networksActionsTypes.CREATE_NETWORK_SUCCESS, network, member: body.member });
      const failure = (error) => ({ type: networksActionsTypes.CREATE_NETWORK_FAILURE, error });

      dispatch(request());

      provider.create(body).then(
        network => resolve(dispatch(success(network.data)))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.CREATE, orderTypes.NETWORK));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deleteNetwork = (id) => {
  return dispatch => {
      return new Promise((resolve, reject) => {
        let provider = new NetworksProvider();
        const request = () => ({ type: networksActionsTypes.DELETE_NETWORK_REQUEST});
        const success = () => ({ type: networksActionsTypes.DELETE_NETWORK_SUCCESS, id });
        const failure = (error) => ({ type: networksActionsTypes.DELETE_NETWORK_FAILURE, error });

        dispatch(request());

        provider.delete(id).then(
          resolve(dispatch(success()))
        ).catch((error) => {
          toast.error(generateErrorMessage(errorTypes.DELETE, orderTypes.NETWORK, id));
          return reject(dispatch(failure(error)));
        });
      });
  };
};

export const getFedNetworks = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.GET_FED_NETWORKS_REQUEST});
      const success = (networks) => ({ type: networksActionsTypes.GET_FED_NETWORKS_SUCCESS, networks });
      const failure = (error) => ({ type: networksActionsTypes.GET_FED_NETWORKS_FAILURE, error });

      dispatch(request());

      provider.getFetNets().then(
        network => resolve(dispatch(success(network.data)))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.GET, orderTypes.FEDERATED_NETWORK));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getFedNetworkData = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.GET_FED_DATA_NETWORK_REQUEST});
      const success = (networks) => ({ type: networksActionsTypes.GET_FED_DATA_NETWORK_SUCCESS, networks });
      const failure = (error) => ({ type: networksActionsTypes.GET_FED_DATA_NETWORK_FAILURE, error });

      dispatch(request());

      provider.getFedNetData(id).then(
        network => resolve(dispatch(success(network.data)))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.DATA, orderTypes.FEDERATED_NETWORK, id));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const createFedNetwork = (body) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.CREATE_FED_NETWORK_REQUEST});
      const success = (network) => ({ type: networksActionsTypes.CREATE_FED_NETWORK_SUCCESS, network });
      const failure = (error) => ({ type: networksActionsTypes.CREATE_FED_NETWORK_FAILURE, error });

      dispatch(request());

      provider.createFedNet(body).then(
        network => resolve(dispatch(success(network.data)))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.CREATE, orderTypes.FEDERATED_NETWORK));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deleteFedNetwork = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.DELETE_FED_NETWORK_REQUEST});
      const success = () => ({ type: networksActionsTypes.DELETE_FED_NETWORK_SUCCESS, id });
      const failure = (error) => ({ type: networksActionsTypes.DELETE_FED_NETWORK_FAILURE, error });

      dispatch(request());

      provider.deletefedNet(id).then(
        resolve(dispatch(success()))
      ).catch((error) => {
        toast.error(generateErrorMessage(errorTypes.DELETE, orderTypes.FEDERATED_NETWORK, id));
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const getNetworkSecurityGroupRules = (id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.GET_NETWORK_SECURITY_GROUP_RULES_REQUEST});
      const success = (securityGroupRules) => ({
        type: networksActionsTypes.GET_NETWORK_SECURITY_GROUP_RULES_SUCCESS,
        securityGroupRules: securityGroupRules
      });
      const failure = (error) => ({
        type: networksActionsTypes.GET_NETWORK_SECURITY_GROUP_RULES_FAILURE,
        error: error
      });

      dispatch(request());

      provider.getSecurityGroupRules(id).then(
        securityGroupRules => resolve(dispatch(success(securityGroupRules.data)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to get security group rules for network order: ' + id + '. ' + message + '.');
        return reject(dispatch(failure(error)));
      });
    });
  };
};

export const deleteNetworkSecurityGroupRule = (ruleId, orderId) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new NetworksProvider();
      const request = () => ({ type: networksActionsTypes.DELETE_NETWORK_SECURITY_GROUP_RULE_REQUEST});
      const success = () => ({
        type: networksActionsTypes.DELETE_NETWORK_SECURITY_GROUP_RULE_SUCCESS,
        ruleId: ruleId
      });
      const failure = (error) => ({
        type: networksActionsTypes.DELETE_NETWORK_SECURITY_GROUP_RULE_FAILURE,
        error: error
      });

      dispatch(request());

      provider.deleteSecurityGroupRule(ruleId, orderId).then(
        () => resolve(dispatch(success()))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to delete security group rule: ' + ruleId + ' for network order: ' +
                    orderId + '. ' + message + '.');
        return reject(dispatch(failure(error)));
      });
    });
  };
};
