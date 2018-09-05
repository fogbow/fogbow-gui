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
            <div className="details">
                <h2>Information</h2>
                <hr className="horizontal-line"/>

                <p className="bolder">Network id</p>
                <p>{this.state.orderData.id || '-'}</p>

                <p className="bolder">Label</p>
                <p>{this.state.orderData.label || '-'}</p>

                <p className="bolder">Address (CIDR)</p>
                <p>{this.state.orderData.address || '-'}</p>

                <p className="bolder">Gateway</p>
                <p>{this.state.orderData.gateway || '-'}</p>

                <p className="bolder">Network Interface</p>
                <p>{this.state.orderData.networkInterface || '-'}</p>

                <p className="bolder">MAC Interface</p>
                <p>{this.state.orderData.macinterface || '-'}</p>

                <p className="bolder">State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(NetworkDetails);