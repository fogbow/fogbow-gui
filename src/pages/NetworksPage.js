import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

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
      networkOrders: []
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
    if (props.networks.loading && !_.isEqual(props.networks.data, state.networkOrders)) {
      return {networkOrders: props.networks.data};
    }

    return null;
  };

  getActions(order) {
    return [
      { 
        text: 'Add Security Rule',
        value: order.instanceId,
        modalId: '#security-rule-form',
        onClick: this.handleSecurityRuleForm 
      }
    ];
  }

  getActionsMap() {
    const actionsMap = {};
    this.state.networkOrders.map(order => {
      actionsMap[order.id] = this.getActions(order)
    })
    return actionsMap;
  }

  render() {
    const actionsByOrder = this.getActionsMap()
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.state.networkOrders} type={'networks'} handleShow={this.handleShow}
                      forms={[<NetworkForm/>,
                              <SecurityRuleForm orderType='network'
                                                instanceId={this.state.instanceId}/>
                             ]}
                      actionsByOrder={actionsByOrder}/>) :
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
