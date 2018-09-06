import { computesActionsTypes } from '../actions/computes.actions.types';

const images = (state = {loading: false}, action) => {
    switch (action.type) {
        case computesActionsTypes.GET_IMAGES_REQUEST:
            return { loading: false };
        case computesActionsTypes.GET_IMAGES_SUCCESS:
            return {
                data: action.images,
                loading: true
            };
        case computesActionsTypes.GET_IMAGES_FAILURE:
            return { ...state, error: action.error };
        
        default:
            return state;
    }
};

export default images;