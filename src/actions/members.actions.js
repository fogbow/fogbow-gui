import { membersActionsTypes } from './members.actions.types';
import MembersProvider from '../providers/members.provider';

export const getMembers = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const request = () => ({ type: membersActionsTypes.GET_MEMBERS_REQUEST});
            const success = (members) => ({ type: membersActionsTypes.GET_MEMBERS_SUCCESS, members });
            const failure = (error) => ({ type: membersActionsTypes.GET_MEMBERS_FAILURE, error });

            dispatch(request());

            MembersProvider.get().then(
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
            const request = () => ({ type: membersActionsTypes.GET_MEMBER_DATA_REQUEST});
            const success = (quota) => ({ type: membersActionsTypes.GET_MEMBER_DATA_SUCCESS, quota, id });
            const failure = (error) => ({ type: membersActionsTypes.GET_MEMBER_DATA_FAILURE, error });

            dispatch(request());

            MembersProvider.getQuota(id).then(
                quota => resolve(dispatch(success(quota.data)))
            ).catch(
                error => reject(dispatch(failure(error)))
            );
        });
    };
};