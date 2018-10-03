import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getComputeData } from '../actions/computes.actions';

class ComputeDetails extends Component {
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
        const networks = this.state.orderData.networks ? Object.entries(this.state.orderData.networks)
          .map((network) =>
              <div key={network[1]}>
                <p className="bolder">{network[1]}</p>
                <p>{network[0]}</p>
              </div>)
          : '-';

        return (
            <div className="details">
                <button type="button" className="close" aria-label="Close"
                        onClick={() => this.props.handleHide()}>
                    <span aria-hidden="true">&times;</span>
                </button>

                <h2>
                  {this.state.orderData.hostName ? this.state.orderData.hostName : 'Information'}
                </h2>
                <hr className="horizontal-line"/>

                <p className="bolder">ID</p>
                <p>{this.state.orderData.id || '-'}</p>

                <p className="bolder">State</p>
                <p>{this.state.orderData.state || '-'}</p>

                <h3>Specs</h3>
                <hr className="horizontal-line"/>

                <p className="bolder">VCPUs</p>
                <p>{this.state.orderData.vCPU || '-'}</p>

                <p className="bolder">RAM</p>
                <p>{this.state.orderData.ram || '-'} MB</p>

                <p className="bolder">Disk</p>
                <p>{this.state.orderData.disk || '-'} GB</p>

                <h3>Networks</h3>
                <hr className="horizontal-line"/>

                {networks}

                <p className="bolder">Local IP Addresses</p>
                <p>{this.state.orderData.ipAddresses || '-'}</p>

                <h3>Image</h3>
                <hr className="horizontal-line"/>

                <p className="bolder">Name</p>
                <p>
                  {this.state.orderData.image ? this.state.orderData.image.split(':')[1] : '-'}
                </p>
                <p className="bolder">ID</p>
                <p>
                  {this.state.orderData.image ? this.state.orderData.image.split(':')[0] : '-'}
                </p>

                <h3>Connectivity</h3>
                <hr className="horizontal-line"/>

                <p className="bolder">SSH public address</p>
                <p>{this.state.orderData.sshTunnelConnectionData ?
                    this.state.orderData.sshTunnelConnectionData.sshPublicAddress: '-'}</p>

                <p className="bolder">SSH user name</p>
                <p>{this.state.orderData.sshTunnelConnectionData ?
                    this.state.orderData.sshTunnelConnectionData.sshUserName: '-'}</p>

                <p className="bolder">Public Key</p>
                <textarea className="public-key" cols="70" rows="5"
                 value={this.state.orderData.publicKey || '-'} readOnly></textarea>

                <p className="bolder">User Data</p>
                <p>{this.state.orderData.userData || '-'}</p>
            </div>
        );
    }
}

export default connect()(ComputeDetails);
