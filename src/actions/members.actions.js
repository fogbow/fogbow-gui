import { membersActionsTypes } from './members.actions.types';
import MembersProvider from '../providers/members.provider';

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
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getMemberData = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let provider = new MembersProvider();
            const request = () => ({ type: membersActionsTypes.GET_MEMBER_DATA_REQUEST});
            const success = (quota) => ({ type: membersActionsTypes.GET_MEMBER_DATA_SUCCESS, quota, id });
            const failure = (error) => ({ type: membersActionsTypes.GET_MEMBER_DATA_FAILURE, error });

            dispatch(request());

            provider.getQuota(id).then(
                quota => resolve(dispatch(success(quota.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};

export const getAllMembersData = (members) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            let promises = members.map(id => dispatch(getMemberData(id)));
            Promise.all(promises)
                .then(data => {
                    let response = data.map(action => action.quota)
                        .reduce((a,b) => ({
                                totalQuota: sumAllocation(a.totalQuota, b.totalQuota),
                                usedQuota: sumAllocation(a.usedQuota, b.usedQuota),
                                availableQuota: sumAllocation(a.availableQuota, b.availableQuota)
                            })
                        );
                    resolve(response);
                    
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