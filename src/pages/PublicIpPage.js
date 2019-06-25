import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import PublicIpForm from '../components/PublicIpForm';
import SecurityRuleForm from '../components/SecurityRuleForm';
import { getPublicIps } from '../actions/publicIps.actions';
import { getComputes } from '../actions/computes.actions';
import PublicIpDetails from '../components/PublicIpDetails';

class PublicIpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: true,
      orderId: '',
      intervalId: '',
      publicIpOrders: []
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch(getPublicIps());
    dispatch(getComputes());

    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible) {
            await dispatch(getPublicIps());
            await dispatch(getComputes());
        }
      }, env.refreshTime)
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  }

  handleShow = (orderId) => {
    this.setState({
      tableVisible: false,
      orderId
    });
  };

  handleHide = () => {
    this.setState({
      tableVisible: true
    });
  };

  handleSecurityRuleForm = (event) => {
    event.preventDefault();

    const instanceId = event.target.value;

    this.setState({instanceId: instanceId});
  };

  static getDerivedStateFromProps = (props, state) => {
    if (props.publicIps.loading && !_.isEqual(props.publicIps.data, state.publicIpOrders)) {
      return {publicIpOrders: props.publicIps.data};
    }

    return null;
  };

  render() {
    return (
      <div>
        {this.state.tableVisible ?
         (<OrderList orders={this.state.publicIpOrders} type={'publicip'} disabledHeaders={['Name']}
                     forms={[<PublicIpForm/>,
                             <SecurityRuleForm orderType='publicip'
                                               instanceId={this.state.instanceId}/>
                            ]}
                     handleSecurityRuleForm={this.handleSecurityRuleForm}
                     handleShow={this.handleShow} handleHide={this.handleHide}/>) :
         <PublicIpDetails id={this.state.orderId} handleHide={this.handleHide}/>}
      </div>
    );
  }
}

const stateToProps = state => ({
  publicIps: state.publicIps,
  securityRules: state.securityRules
});

export default connect(stateToProps)(PublicIpPage);
