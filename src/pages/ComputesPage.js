import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import ComputeForm from '../components/ComputeForm';
import { getComputes } from '../actions/computes.actions';
import ComputeDetails from '../components/ComputeDetails';

class ComputesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: true,
      orderId: '',
      intervalId: '',
      computeOrders: []
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(getComputes());
    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible)
          await dispatch(getComputes());
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
  }

  handleHide = () => {
    this.setState({
      tableVisible: true
    });
  };

  static getDerivedStateFromProps = (props, state) => {
    if (props.computes.loading && !_.isEqual(props.computes.data, state.computeOrders)) {
      return {computeOrders: props.computes.data};
    }

    return null;
  };

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.state.computeOrders} forms={[<ComputeForm/>]}
                      type={'computes'} handleShow={this.handleShow}/>) :
          <ComputeDetails id={this.state.orderId} handleHide={this.handleHide}/>
        }
      </div>
    );
  }
}

const stateToProps = state => ({
  computes: state.computes
});

export default connect(stateToProps)(ComputesPage);
