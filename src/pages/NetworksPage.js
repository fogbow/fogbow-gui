import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import { getNetworks } from '../actions/networks.actions';
import NetworkForm from '../components/NetworkForm';
import SecurityRuleForm from '../components/SecurityRuleForm';
import NetworkDetails from '../components/NetworkDetails';

class NetworksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: true,
      orderId: '',
      instanceId: '',
      intervalId: '',
      showSecurityRuleForm: false
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(getNetworks());
    this.setState({
      intervalId:setInterval(async() => {
        if (this.state.tableVisible)
          await dispatch(getNetworks());
      }, env.refreshTime)
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  }

  get networks() {
    return this.props.networks.loading ? this.props.networks.data: [];
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

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.networks} type={'networks'} handleShow={this.handleShow}
                      forms={[<NetworkForm/>,
                              <SecurityRuleForm orderType='network'
                                                instanceId={this.state.instanceId}/>
                             ]}
                      handleSecurityRuleForm={this.handleSecurityRuleForm}/>) :
          <NetworkDetails id={this.state.orderId} handleHide={this.handleHide}/>}
      </div>
    );
  }
}

const stateToProps = state => ({
  networks: state.networks,
  securityRules: state.securityRules
});

export default connect(stateToProps)(NetworksPage);
