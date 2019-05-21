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
    const assignedIps = this.state.orderData.assignedIps ? this.state.orderData.assignedIps
      .map((assignedIp, idx) =>
        <div key={assignedIp.id}>
          <p>Compute ID: {assignedIp.computeId}</p>
          <p>IP: {assignedIp.ip}</p>
        </div>)
      : <p>-</p>;

    return (
      <div className="details">
        <button type="button" class="close" aria-label="Close" onClick={() => this.props.handleHide()}>
            <span aria-hidden="true">&times;</span>
        </button>
        <h2>Information</h2>
        <hr className="horizontal-line"/>

        <p className="bolder">Name</p>
        <p>{this.state.orderData.name || '-'}</p>

        <p className="bolder">ID</p>
        <p>{this.state.orderData.instanceId || '-'}</p>

        <p className="bolder">State</p>
        <p>{this.state.orderData.state || '-'}</p>

        <p className="bolder">CIDR</p>
        <p>{this.state.orderData.cidr || '-'}</p>

        <p className="bolder">Providers</p>
        <p>{this.state.orderData.providers ? this.state.orderData.providers.toString() : '-'}</p>

        <p className="bolder">Compute IDs and IPs</p>
        {assignedIps}

      </div>
    );
  }
}

export default connect()(FedNetDetails);
