import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getNetworkData } from '../actions/networks.actions';

class NetworkDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        }
    }
    

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(getNetworkData(this.props.id)).then(data => {
            this.setState({
                orderData: data.networks
            });
        })
    }

    render() {
        return (
            <div>
                <h2>Information</h2>

                <p>Network id</p>
                <p>{this.state.orderData.id || '-'}</p>
                <p>Label</p>
                <p>{this.state.orderData.label || '-'}</p>
                <p>Address (CIDR)</p>
                <p>{this.state.orderData.address || '-'}</p>
                <p>Gateway</p>
                <p>{this.state.orderData.gateway || '-'}</p>
                <p>Network Interface</p>
                <p>{this.state.orderData.networkInterface || '-'}</p>
                <p>MAC Interface</p>
                <p>{this.state.orderData.macinterface || '-'}</p>
                <p>State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(NetworkDetails);