import { toast } from 'react-toastify';

import { membersActionsTypes } from './members.actions.types';
import MembersProvider from '../providers/members.provider';
import CloudsProvider from '../providers/clouds.provider';

export const getMembers = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new MembersProvider();
      const request = () => ({ type: membersActionsTypes.GET_MEMBERS_REQUEST});
      const success = (members) => ({ type: membersActionsTypes.GET_MEMBERS_SUCCESS, members });
      const failure = (error) => ({ type: membersActionsTypes.GET_MEMBERS_FAILURE, error });

      dispatch(request());

      provider.get().then(
        members => resolve(dispatch(success(members.data)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to retrieve providers list. ' + message + '.');
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getMemberData = (id, cloudId) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let provider = new MembersProvider();
      const request = () => ({ type: membersActionsTypes.GET_MEMBER_DATA_REQUEST});
      const success = (quota) => ({ type: membersActionsTypes.GET_MEMBER_DATA_SUCCESS, quota, id });
      const failure = (error) => ({ type: membersActionsTypes.GET_MEMBER_DATA_FAILURE, error });

      dispatch(request());

      provider.getQuota(id, cloudId).then(
        quota => resolve(dispatch(success(quota.data)))
      ).catch((error) => {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to retrieve quota data from provider: ' + id + '. ' + message + '.');
        return reject(dispatch(failure(error)))
      });
    });
  };
};

export const getAllMembersData = (members) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let promises = members.map(memberId => dispatch(getMemberQuotaFromAllClouds(memberId)));

      Promise.all(promises)
        .then(data => {
          let response = data.map(quota => quota)
            .reduce((a,b) => ({
              totalQuota: sumAllocation(a.totalQuota, b.totalQuota),
              usedQuota: sumAllocation(a.usedQuota, b.usedQuota),
              availableQuota: sumAllocation(a.availableQuota, b.availableQuota)
            }));
          resolve(response);
        })
        .catch((error) => {
          const message = error.response ? error.response.data.message : error.message;
          toast.error('Unable to retrieve quota data from all providers. ' + message + '.');
          return reject(error);
        });
      });
  };
};

export const getMemberQuotaFromAllClouds = (memberId) => {
  return dispatch => {
    return new Promise(async(resolve, reject) => {
      let provider = new CloudsProvider();
      let promises = [];

      try {
        let clouds = await provider.getCloudsByMemberId(memberId);
        promises = clouds.data.map(cloudId => dispatch(getMemberData(memberId, cloudId)));
      } catch(error) {
        const message = error.response ? error.response.data.message : error.message;
        toast.error('Unable to retrieve clouds list from provider: ' + memberId + '. ' + message + '.');
        return reject(error);
      }

      Promise.all(promises)
        .then(data => {
          let response = data.map(action => action.quota)
            .reduce((a,b) => ({
              totalQuota: sumAllocation(a.totalQuota, b.totalQuota),
              usedQuota: sumAllocation(a.usedQuota, b.usedQuota),
              availableQuota: sumAllocation(a.availableQuota, b.availableQuota)
            }));
          resolve(response);
        })
        .catch((error) => {
          const message = error.response ? error.response.data.message : error.message;
          toast.error('Unable to retrieve quota data from provider: ' + memberId + '. ' + message + '.');
          return reject(error);
        });
    });
  };
};

const sumAllocation = (a, b) => {
  return {
    vCPU: a.vCPU + b.vCPU,
    ram: a.ram + b.ram,
    instances: a.instances + b.instances
  }
}
