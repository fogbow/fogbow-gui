import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import ComputeForm from '../components/ComputeForm';
import { getComputes, hibernateCompute, pauseCompute, resumeCompute } from '../actions/computes.actions';
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

  handlePause = (event) => {
    event.preventDefault();
    const instanceId = event.target.value;
    const { dispatch } = this.props;
    dispatch(pauseCompute(instanceId))
  }

  handleHibernate = (event) => {
    event.preventDefault();
    const instanceId = event.target.value;
    const { dispatch } = this.props;
    dispatch(hibernateCompute(instanceId))
  }

  handleResume = (event) => {
    event.preventDefault();
    const instanceId = event.target.value;
    const { dispatch } = this.props;
    dispatch(resumeCompute(instanceId))
  }

  getActions(order) {
    return [
      { 
        text: 'Pause',
        value: order.instanceId,
        modalId: "",
        onClick: this.handlePause 
      },
      { 
        text: 'Hibernate',
        value: order.instanceId,
        modalId: "",
        onClick: this.handleHibernate 
      },
      { 
        text: 'Resume',
        value: order.instanceId,
        modalId: "",
        onClick: this.handleResume 
      },
    ];
  }

  getActionsMap() {
    const actionsMap = {};
    this.state.computeOrders.map(order => {
      actionsMap[order.id] = this.getActions(order)
    })
    return actionsMap;
  }

  render() {
    const actionsByOrder = this.getActionsMap();
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.state.computeOrders} forms={[<ComputeForm/>]}
                      type={'computes'} handleShow={this.handleShow} 
                      actionsByOrder={actionsByOrder}/>) :
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
