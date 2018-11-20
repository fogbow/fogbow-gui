import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import { getVolumes } from '../actions/volumes.actions';
import VolumeForm from '../components/VolumeForm';
import VolumeDetails from '../components/VolumeDetails';


class VolumesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: true,
      orderId: '',
      intervalId: '',
      volumeOrders: []
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(getVolumes());
    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible)
          await dispatch(getVolumes());
      }, env.refreshTime)
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  }

  handleShow = (orderId) => {
    this.setState({
      tableVisible: false,
      orderId: orderId
    });
  };

  handleHide = () => {
    this.setState({
      tableVisible: true
    });
  };

  static getDerivedStateFromProps = (props, state) => {
    if (props.volumes.loading && !_.isEqual(props.volumes.data, state.volumeOrders)) {
      return {volumeOrders: props.volumes.data};
    }

    return null;
  };

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.state.volumeOrders} forms={[<VolumeForm/>]}
                      type={'volumes'} handleShow={this.handleShow}/>) :
          <VolumeDetails id={this.state.orderId} handleHide={this.handleHide}/>
        }
      </div>
    );
  }
}

const stateToProps = state => ({
  volumes: state.volumes
});

export default connect(stateToProps)(VolumesPage);
