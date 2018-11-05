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
      <div className="details">
        <button type="button" class="close" aria-label="Close" onClick={() => this.props.handleHide()}>
            <span aria-hidden="true">&times;</span>
        </button>
        <h2>Information</h2>
        <hr className="horizontal-line"/>

        <p className="bolder">Name</p>
        <p>{this.state.orderData.name || '-'}</p>

        <p className="bolder">ID</p>
        <p>{this.state.orderData.id || '-'}</p>

        <p className="bolder">State</p>
        <p>{this.state.orderData.orderState || '-'}</p>

        <p className="bolder">CIDR</p>
        <p>{this.state.orderData.cidrNotation || '-'}</p>

        <p className="bolder">Allowed Members</p>
        <p>{this.state.orderData.allowedMembers ? this.state.orderData.allowedMembers.toString() : '-'}</p>

      </div>
    );
  }
}

export default connect()(FedNetDetails);
