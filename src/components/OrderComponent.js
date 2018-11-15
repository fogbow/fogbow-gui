import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/order.css';
import { deleteAttachment } from '../actions/attachments.actions';
import { deleteCompute } from '../actions/computes.actions';
import { deleteNetwork, deleteFedNetwork } from '../actions/networks.actions';
import { deleteVolume } from '../actions/volumes.actions';
import { deletePublicIp } from '../actions/publicIps.actions';

const mapping = {
    computes: 'Compute',
    networks: 'Network',
    federatedNetworks: 'Federated Network',
    volumes: 'Volume',
    attachments: 'Attachment',
    publicip: 'Public IP',
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
    // NOTE(pauloewerton): any new order action should be placed here.
    const dropdownMenu = (this.props.type === 'publicip' || this.props.type === 'networks') ?
              (<div className='btn-group' role='group'>
                  <button className='btn btn-secondary dropdown-toggle'
                          data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'
                          id='btnGroupDrop1'>
                  </button>
                  <div className='dropdown-menu order-dropdown' aria-labelledby='btnGroupDrop1'>
                    <button className='dropdown-item' onClick={this.props.handleSecurityRuleForm}
                            value={this.props.order.instanceId} data-toggle='modal'
                            data-target='#security-rule-form'>
                      Add Security Rule
                    </button>
                  </div>
               </div>) : undefined;

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
        <td className='text-center'>
          <div className='btn-group' role='group'>
            <button type='button' className='btn btn-primary btn-danger' onClick={this.handleDelete}>
              Terminate {mapping[this.props.type]}
            </button>
            {dropdownMenu}
          </div>
        </td>
      </tr>
    );
  }
}

export default connect()(OrderComponent);
