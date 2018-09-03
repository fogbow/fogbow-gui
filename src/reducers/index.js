import { combineReducers } from 'redux';

import members from './members.reducer';
import computes from './computes.reducer';
import volumes from './volumes.reducer';
import networks from './networks.reducer';
import fetNetworks from './fedNetworks.reducer';
import attachments from './attachments.reducer';
import images from './images.reducer';
import quota from './quota.reducer';

export default combineReducers({
    members,
    computes,
    volumes,
    networks,
    fetNetworks,
    attachments,
    images,
    quota
});