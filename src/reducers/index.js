import { combineReducers } from 'redux';

import members from './members.reducer';
import computes from './computes.reducer';
import volumes from './volumes.reducer';

export default combineReducers({
    members,
    computes,
    volumes
});