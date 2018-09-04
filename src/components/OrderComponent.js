import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deleteAttachment } from '../actions/attachments.actions';
import { deleteCompute } from '../actions/computes.actions';
import { deleteNetwork, deleteFedNetwork } from '../actions/networks.actions';

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
            case 'network':
                dispatch(deleteNetwork(id));
                break;
            case 'federatedNetworks':
                dispatch(deleteFedNetwork(id));
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
                <td><a href="http://github.com/fogbow">{this.props.order.instanceId}</a></td>
                {this.props.disableProvider ? undefined:
                    <td>{this.props.order.provider}</td>}
                <td>{this.props.order.state}</td>
                <td>
                    <button type="button" class="btn btn-danger" onClick={this.handleDelete}>Terminate {mapping[this.props.type]}</button>
                </td>
            </tr>
        );
    }
}

export default connect()(OrderComponent);