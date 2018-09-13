import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deleteAttachment } from '../actions/attachments.actions';
import { deleteCompute } from '../actions/computes.actions';
import { deleteNetwork, deleteFedNetwork } from '../actions/networks.actions';
import { deleteVolume } from '../actions/volumes.actions';

const mapping = {
    computes: 'compute',
    networks: 'network',
    federatedNetworks: 'federated Network',
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
        
            default:
                break;
        }

    };

    render() {
        return (
            <tr>
                <td><a href="#" onClick={this.props.handleShow}>{this.props.order.instanceId}</a></td>
                <td>{this.props.order.name}</td>
                {this.props.disableProvider ? undefined:
                    <td>{this.props.order.provider}</td>}
                <td>{this.props.order.state}</td>
                <td>
                    <button type="button" className="btn btn-danger" onClick={this.handleDelete}>Terminate {mapping[this.props.type]}</button>
                </td>
            </tr>
        );
    }
}

export default connect()(OrderComponent);