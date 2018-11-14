import React, { Component } from 'react';
import { connect } from 'react-redux';

import SecurityGroupRulesComponent from './SecurityGroupRulesComponent';
import { getPublicIpData } from '../actions/publicIps.actions';
import { getPublicIpSecurityGroupRules } from '../actions/publicIps.actions';

class PublicIpDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: {},
      securityGroupRules: []
    }
  }

  componentDidMount() {
    let { dispatch } = this.props;

    dispatch(getPublicIpData(this.props.id)).then(data => {
      this.setState({
        orderData: data.publicIp
      });
    });

    dispatch(getPublicIpSecurityGroupRules(this.props.id)).then(data => {
      this.setState({
        securityGroupRules: data
      });
    });
  }

  render() {
    const securityGroupRules = this.state.securityGroupRules.length <= 0 ? '-' :
      <SecurityGroupRulesComponent securityGroupRules={this.state.securityGroupRules}
                                   orderId={this.state.orderData.id} orderType='publicIp'/>;

    return (
      <div id="details" className="details">
        <button type="button" className="close" aria-label="Close"
                onClick={() => this.props.handleHide()}>
            <span aria-hidden="true">&times;</span>
        </button>

        <h2>Public IP Details</h2>
        <hr className="horizontal-line"/>

        <p className="bolder">ID</p>
        <p>{this.state.orderData.id || '-'}</p>

        <p className="bolder">IP Address</p>
        <p>{this.state.orderData.ip || '-'}</p>

        <p className="bolder">Compute Name</p>
        <p>{this.state.orderData.computeName || '-'}</p>

        <p className="bolder">Compute ID</p>
        <p>{this.state.orderData.computeId || '-'}</p>

        <p className="bolder">Security Group Rules</p>
        {securityGroupRules}
      </div>
    );
  }
}

export default connect()(PublicIpDetails);
