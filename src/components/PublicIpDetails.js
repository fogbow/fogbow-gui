import React, { Component } from 'react';
import { connect } from 'react-redux';

import SecurityRulesComponent from './SecurityRulesComponent';
import { getPublicIpData } from '../actions/publicIps.actions';
import { getPublicIpSecurityRules } from '../actions/publicIps.actions';

class PublicIpDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: {},
      securityRules: []
    }
  }

  componentDidMount() {
    let { dispatch } = this.props;

    dispatch(getPublicIpData(this.props.id)).then(data => {
      this.setState({
        orderData: data.publicIp
      });
    });

    dispatch(getPublicIpSecurityRules(this.props.id)).then(data => {
      this.setState({
        securityRules: data
      });
    });
  }

  render() {
    const securityRules = this.state.securityRules.length <= 0 ? '-' :
      <SecurityRulesComponent securityRules={this.state.securityRules} orderType='publicIp'
                              orderId={this.state.orderData.id}/>;

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

        <p className="bolder">Security Rules</p>
        {securityRules}
      </div>
    );
  }
}

export default connect()(PublicIpDetails);
