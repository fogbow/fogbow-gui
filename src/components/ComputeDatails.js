import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getComputeData } from '../actions/computes.actions';

class ComputeDatails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        }
    }
    

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(getComputeData(this.props.id)).then(data => {
            this.setState({
                orderData: data.compute[0]
            });
        })
    }
    
    render() {
        return (
            <div>
                <h2>Information</h2>

                <p>Instance id</p>
                <p>{this.state.orderData.id || '-'}</p>
                <p>vCPU</p>
                <p>{this.state.orderData.vCPU || '-'}</p>
                <p>Memory</p>
                <p>{this.state.orderData.ram || '-'}</p>
                <p>Local ip address</p>
                <p>{this.state.orderData.localIpAddress || '-'}</p>
                <p>SSH public address</p>
                <p>{this.state.orderData.sshTunnelConnectionData ? 
                    this.state.orderData.sshTunnelConnectionData.sshPublicAddress: '-'}</p>
                <p>Federated ip address</p>
                {/* <p>{this.state.orderData || '-'}</p> */}
                <p>SSH user name</p>
                <p>{this.state.orderData.sshTunnelConnectionData ?
                    this.state.orderData.sshTunnelConnectionData.sshUserName: '-'}</p>            
                <p>SSH extra ports</p>
                {/* <p>{this.state.orderData || '-'}</p>             */}
                <p>State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(ComputeDatails);