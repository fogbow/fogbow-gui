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
                orderData: data.compute
            });
        })
    }
    
    render() {
        return (
            <div className="details">
                <button type="button" class="close" aria-label="Close" onClick={() => this.props.handleHide()}>
                    <span aria-hidden="true">&times;</span>
                </button>

                <h2>Information</h2>
                <hr className="horizontal-line"/>

                <p className="bolder">Instance id</p>
                <p>{this.state.orderData.id || '-'}</p>

                <p className="bolder">vCPU</p>
                <p>{this.state.orderData.vCPU || '-'}</p>

                <p className="bolder">Memory</p>
                <p>{this.state.orderData.ram || '-'}</p>

                <p className="bolder">Local ip address</p>
                <p>{this.state.orderData.localIpAddress || '-'}</p>

                <p className="bolder">SSH public address</p>
                <p>{this.state.orderData.sshTunnelConnectionData ? 
                    this.state.orderData.sshTunnelConnectionData.sshPublicAddress: '-'}</p>

                <p className="bolder"> SSH user name</p>
                <p>{this.state.orderData.sshTunnelConnectionData ?
                    this.state.orderData.sshTunnelConnectionData.sshUserName: '-'}</p>

                <p className="bolder">State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(ComputeDatails);