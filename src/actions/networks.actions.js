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
      toast.error(generateErrorMessage(errorTypes.GET, orderTypes.NETWORK));
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
