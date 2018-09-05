import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAttachmentData } from '../actions/attachments.actions';

class AttachmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        }
    }

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(getAttachmentData(this.props.id)).then(data => {
            this.setState({
                orderData: data.attachments
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
                <p>State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(AttachmentDetails);