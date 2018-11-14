import React, { Component } from 'react';
import { connect } from 'react-redux';

import SecurityGroupRulesComponent from './SecurityGroupRulesComponent';
import { getNetworkData } from '../actions/networks.actions';
import { getNetworkSecurityGroupRules } from '../actions/networks.actions';

class NetworkDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        orderData: {},
        securityGroupRules: []
    }
  }

  componentDidMount() {
    let { dispatch } = this.props;

    dispatch(getNetworkData(this.props.id)).then(data => {
      this.setState({
          orderData: data.networks
      });
    });

    dispatch(getNetworkSecurityGroupRules(this.props.id)).then(data => {
      this.setState({
        securityGroupRules: data
      });
    });
  }

  render() {
    const securityGroupRules = this.state.securityGroupRules.length <= 0 ? '-' :
      <SecurityGroupRulesComponent securityGroupRules={this.state.securityGroupRules}
                                   orderId={this.state.orderData.id} orderType='network'/>;

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

        <p className="bolder">CIDR</p>
        <p>{this.state.orderData.cidr || '-'}</p>

        <p className="bolder">Gateway</p>
        <p>{this.state.orderData.gateway || '-'}</p>

        <p className="bolder">Allocation Mode</p>
        <p>{this.state.orderData.allocationMode || '-'}</p>

        <p className="bolder">Security Group Rules</p>
        {securityGroupRules}
      </div>
    );
  }
}

export default connect()(NetworkDetails);
