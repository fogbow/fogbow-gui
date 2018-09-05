import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFedNetworkData } from '../actions/networks.actions';

class FedNetDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        }
    }
    

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(getFedNetworkData(this.props.id)).then(data => {
            this.setState({
                orderData: data.networks
            });
        })
    }

    render() {
        return (
            <div>
                <h2>Information</h2>

                <p>Federated network id</p>
                <p>{this.state.orderData.id || '-'}</p>
                <p>Label</p>
                <p>{this.state.orderData.label || '-'}</p>
                <p>CIDR</p>
                <p>{this.state.orderData.cidrNotation || '-'}</p>
                <p>Allowed Members</p>
                <p>{this.state.orderData.allowedMembers ? this.state.orderData.allowedMembers.toString() : '-'}</p>
                <p>State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(FedNetDetails);