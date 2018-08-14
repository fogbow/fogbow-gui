import { combineReducers } from 'redux';

import members from './members.reducer';
import computes from './computes.reducer';

export default combineReducers({
    members,
    computes
});