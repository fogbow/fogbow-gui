import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import ComputeForm from '../components/ComputeForm';
import { getComputes, hibernateCompute, pauseCompute, resumeCompute, takeSnapshot } from '../actions/computes.actions';
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

  handleAction = (event) => {
    event.preventDefault();
    const { value: instanceId, name } = event.target;
    const { dispatch } = this.props;

    switch (name) {
      case 'pause':
        dispatch(pauseCompute(instanceId));
        break;
      case 'hibernate':
        dispatch(hibernateCompute(instanceId));
        break;
      case 'resume':
        dispatch(resumeCompute(instanceId))
        break;
      case 'takeSnapshot':
        dispatch(takeSnapshot(instanceId))
        break;
      default:
        break;
    }
  }

  getActions(order) {
    const baseAction = { value: order.instanceId, modelId: "", onClick: this.handleAction };
    return [
      { text: 'Pause', name: 'pause', ...baseAction },
      { text: 'Hibernate', name: 'hibernate', ...baseAction },
      { text: 'Resume', name: 'resume', ...baseAction },
      { text: 'Take snapshot', name: 'takeSnapshot', ...baseAction }
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
