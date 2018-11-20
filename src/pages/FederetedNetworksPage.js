import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import { getFedNetworks } from '../actions/networks.actions';
import FederatedNetworksForm from '../components/FederatedNetworksForm';
import FedNetDetails from '../components/FedNetDetails';

class FederetedNetworksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: true,
      orderId: '',
      intervalId: '',
      federetedNetworkOrders: []
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible)
          await dispatch(getFedNetworks());
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

  static getDerivedStateFromProps = (props, state) => {
    if (props.networks.loading && !_.isEqual(props.networks.data, state.federetedNetworkOrders)) {
      return {federetedNetworkOrders: props.networks.data};
    }

    return null;
  };

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.state.federetedNetworkOrders} handleShow={this.handleShow}
                      type={'fednets'} forms={[<FederatedNetworksForm/>]}/>) :
          <FedNetDetails id={this.state.orderId} handleHide={this.handleHide}/>
        }
      </div>
    );
  }
}

const stateToProps = state => ({
  networks: state.fedNetworks
});

export default connect(stateToProps)(FederetedNetworksPage);
