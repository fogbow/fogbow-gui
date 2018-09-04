import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deleteAttachment } from '../actions/attachments.actions';

const mapping = {
    computes: 'compute',
    networks: 'cetwork',
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