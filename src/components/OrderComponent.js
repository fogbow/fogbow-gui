import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/order.css';
import { deleteAttachment, getAttachments } from '../actions/attachments.actions';
import { deleteCompute, getComputes } from '../actions/computes.actions';
import { deleteNetwork, deleteFedNetwork, getNetworks, getFedNetworks } from '../actions/networks.actions';
import { deleteVolume, getVolumes } from '../actions/volumes.actions';
import { deletePublicIp, getPublicIps } from '../actions/publicIps.actions';
import OrderActions from './OrderActions';

const mapping = {
  computes: 'Compute',
  networks: 'Network',
  federatedNetworks: 'Federated Network',
  volumes: 'Volume',
  attachments: 'Attachment',
  publicip: 'Public IP',
};

class OrderComponent extends Component {
  handleDelete = async (event) => {
    event.preventDefault();

    const { dispatch } = this.props;
    let id = this.props.order.instanceId;
    let type = this.props.type;

    switch (type) {
      case 'computes':
        await dispatch(deleteCompute(id));
        await dispatch(getComputes());
        break;
      case 'networks':
        await dispatch(deleteNetwork(id));
        await dispatch(getNetworks());
        break;
      case 'fednets':
        await dispatch(deleteFedNetwork(id));
        await dispatch(getFedNetworks());
        break;
      case 'volumes':
        await dispatch(deleteVolume(id));
        await dispatch(getVolumes());
        break;
      case 'attachments':
        await dispatch(deleteAttachment(id));
        await dispatch(getAttachments());
        break;
      case 'publicip':
        await dispatch(deletePublicIp(id));
        await dispatch(getPublicIps());
        break;
      default:
        break;
    }
  };
  
  renderDropdownMenu() {
    const actions = this.props.actions;
    return actions.length > 0 ? <OrderActions actions={actions}/> : undefined
  }

  render() {
    const provider = this.props.order.cloudName ?
      this.props.order.cloudName.concat(' @ ', this.props.order.provider) :
      this.props.order.provider;

    return (
      <tr>
        <td><button className="no-style-btn" onClick={this.props.handleShow}>{this.props.order.instanceId}</button></td>
        {this.props.disabledHeaders && this.props.disabledHeaders.indexOf('Name') !== -1 ?
          undefined : <td>{this.props.order.instanceName || '-'}</td>
        }
        {this.props.disabledHeaders && this.props.disabledHeaders.indexOf('Provider') !== -1 ?
          undefined : <td>{provider || '-'}</td>
        }
        {this.props.disabledHeader && this.props.disabledHeaders.indexOf('State') !== -1 ?
          undefined : <td>{this.props.order.state || '-'}</td>
        }
        <td className='text-center'>
          <div className='btn-group' role='group'>
            <button type='button' className='btn btn-primary btn-danger' disabled={this.props.order.state === 'DELETING'} onClick={this.handleDelete}>
              Terminate {mapping[this.props.type]}
            </button>
            { this.renderDropdownMenu() }
          </div>
        </td>
      </tr>
    );
  }
}

export default connect()(OrderComponent);
