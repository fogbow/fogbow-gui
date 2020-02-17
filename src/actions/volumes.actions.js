import { volumesActionsTypes } from './volumes.actions.types';
import VolumesProvider from '../providers/volumes.provider';
import ResourceActions from './common.actions';

export const getAllVolumeAllocation = (providerId, cloudNames) => {
  let resourceProvider = new VolumesProvider();
  const request = () => ({ type: volumesActionsTypes.GET_ALL_VOLUME_ALLOCATION_REQUEST});
  const success = (allocations) => ({ type: volumesActionsTypes.GET_ALL_VOLUME_ALLOCATION_SUCCESS, allocations });
  const failure = (error) => ({ type: volumesActionsTypes.GET_ALL_VOLUME_ALLOCATION_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.getAllocations(providerId, cloudNames, dispatch, resourceProvider, actionTypes);
};

export const getVolumeAllocation = (providerId, cloudName) => {
  let resourceProvider = new VolumesProvider();
  const request = () => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_REQUEST});
  const success = (allocation) => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_SUCCESS, allocation });
  const failure = (error) => ({ type: volumesActionsTypes.GET_VOLUME_ALLOCATION_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.getAllocation(providerId, cloudName, dispatch, resourceProvider, actionTypes);
};

export const getVolumes = () => {
  let provider = new VolumesProvider();
  const request = () => ({ type: volumesActionsTypes.GET_VOLUMES_REQUEST});
  const success = (volumes) => ({ type: volumesActionsTypes.GET_VOLUMES_SUCCESS, volumes });
  const failure = (error) => ({ type: volumesActionsTypes.GET_VOLUMES_FAILURE, error });
  const actionTypes = { request, success, failure };
  return (dispatch) => ResourceActions.listAll(dispatch, provider, actionTypes);
};

export const getVolumeData = (id) => {
  let provider = new VolumesProvider();
  const request = () => ({ type: volumesActionsTypes.GET_DATA_VOLUME_REQUEST});
  const success = (volume) => ({ type: volumesActionsTypes.GET_DATA_VOLUME_SUCCESS, volume });
  const failure = (error) => ({ type: volumesActionsTypes.GET_DATA_VOLUME_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.get(id, dispatch, provider, actionTypes);
};

export const createVolume = (body) => {
  let provider = new VolumesProvider();
  const request = () => ({ type: volumesActionsTypes.CREATE_VOLUME_REQUEST});
  const success = (volume) => ({ type: volumesActionsTypes.CREATE_VOLUME_SUCCESS, volume, provider: body.provider });
  const failure = (error) => ({ type: volumesActionsTypes.CREATE_VOLUME_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.create(body, dispatch, provider, actionTypes);
};

export const deleteVolume = (id) => {
  let provider = new VolumesProvider();
  const request = () => ({ type: volumesActionsTypes.DELETE_VOLUME_REQUEST});
  const success = () => ({ type: volumesActionsTypes.DELETE_VOLUME_SUCCESS, id });
  const failure = (error) => ({ type: volumesActionsTypes.DELETE_VOLUME_FAILURE, error });
  const actionTypes = { request, success, failure };
  return dispatch => ResourceActions.delete(id, dispatch, provider, actionTypes);
};
