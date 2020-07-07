import React, { Component } from 'react';
import { connect } from 'react-redux';

import SecurityRulesComponent from './SecurityRulesComponent';
import { getNetworkData } from '../actions/networks.actions';
import { getNetworkSecurityRules } from '../actions/networks.actions';

class NetworkDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: {},
      securityRules: []
    }
  }

  componentDidMount() {
    let { dispatch } = this.props;

    dispatch(getNetworkData(this.props.id)).then(data => {
      this.setState({
        orderData: data.networks
      });
    });

    dispatch(getNetworkSecurityRules(this.props.id)).then(data => {
      this.setState({
        securityRules: data.securityRules
      });
    });
  }

  render() {
    const securityRules = this.state.securityRules.length <= 0 ? '-' :
      <SecurityRulesComponent securityRules={this.state.securityRules} orderType='network'
                              orderId={this.state.orderData.id}/>;

    return (
      <div className="details">
        <button type="button" className="close" aria-label="Close"
                onClick={() => this.props.handleHide()}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h2>Information</h2>
        <hr className="horizontal-line"/>

        <p className="bolder">Name</p>
        <p>{this.state.orderData.name || '-'}</p>

        <p className="bolder">ID</p>
        <p>{this.state.orderData.id || '-'}</p>

        <p className="bolder">State</p>
        <p>{this.state.orderData.state || '-'}</p>

        <p className="bolder">Fault Message</p>
        <p>{this.state.orderData.faultMessage || '-'}</p>

        <p className="bolder">CIDR</p>
        <p>{this.state.orderData.cidr || '-'}</p>

        <p className="bolder">Gateway</p>
        <p>{this.state.orderData.gateway || '-'}</p>

        <p className="bolder">Allocation Mode</p>
        <p>{this.state.orderData.allocationMode || '-'}</p>

        <p className="bolder">Security Rules</p>
        {securityRules}
      </div>
    );
  }
}

export default connect()(NetworkDetails);
