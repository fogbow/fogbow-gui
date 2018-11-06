import React, { Component } from 'react';
import { connect } from 'react-redux';

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
      intervalId: ''
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

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.networks} handleShow={this.handleShow} type={'fednets'}
                      form={<FederatedNetworksForm/>}/>) :
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
