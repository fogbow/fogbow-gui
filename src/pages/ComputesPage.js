import React, { Component } from 'react';
import { connect } from 'react-redux';

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
      intervalId: ''
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

  get computes() {
    return this.props.computes.loading ? this.props.computes.data: [];
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

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.computes} forms={[<ComputeForm/>]}
                      type={'computes'} handleShow={this.handleShow}/>) :
          <ComputeDetails id={this.state.orderId} handleHide={this.handleHide}/>}
      </div>
    );
  }
}

const stateToProps = state => ({
  computes: state.computes
});

export default connect(stateToProps)(ComputesPage);
