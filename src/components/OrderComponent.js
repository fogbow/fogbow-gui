import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deleteAttachment } from '../actions/attachments.actions';
import { deleteCompute } from '../actions/computes.actions';
import { deleteNetwork, deleteFedNetwork } from '../actions/networks.actions';
import { deleteVolume } from '../actions/volumes.actions';
import { deletePublicIp } from '../actions/publicIps.actions';

const mapping = {
    computes: 'compute',
    networks: 'network',
    federatedNetworks: 'federated network',
    volumes: 'volume',
    attachments: 'attachment'
};


class OrderComponent extends Component {
  handleDelete = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;

    let id = this.props.order.instanceId;
    let type = this.props.type;

    switch (type) {
      case 'computes':
          dispatch(deleteCompute(id));
          break;
      case 'networks':
          dispatch(deleteNetwork(id));
          break;
      case 'fednets':
          dispatch(deleteFedNetwork(id));
          break;
      case 'volumes':
          dispatch(deleteVolume(id));
          break;
      case 'attachments':
          dispatch(deleteAttachment(id));
          break;
      case 'publicip':
          dispatch(deletePublicIp(id));
          break;
      default:
          break;
    }

  };

  render() {
    return (
      <tr>
        <td><a href="#" onClick={this.props.handleShow}>{this.props.order.instanceId}</a></td>
        {this.props.disabledHeaders && this.props.disabledHeaders.indexOf('Name') !== -1 ?
          undefined : <td>{this.props.order.instanceName || '-'}</td>
        }
        {this.props.disabledHeaders && this.props.disabledHeaders.indexOf('Provider') !== -1 ?
          undefined : <td>{this.props.order.provider || '-'}</td>
        }
        {this.props.disabledHeader && this.props.disabledHeaders.indexOf('State') !== -1 ?
          undefined : <td>{this.props.order.state || '-'}</td>
        }
        <td>
          <button type="button" className="btn btn-danger" onClick={this.handleDelete}>
            Terminate {mapping[this.props.type]}
          </button>
        </td>
      </tr>
    );
  }
}

export default connect()(OrderComponent);
