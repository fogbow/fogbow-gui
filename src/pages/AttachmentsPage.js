import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import { getAttachments } from '../actions/attachments.actions';
import { getComputes } from '../actions/computes.actions';
import { getVolumes } from '../actions/volumes.actions';
import AttachmentForm from '../components/AttachmentForm';
import AttachmentDetails from '../components/AttachmentDetails';

class AttachmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableVisible: true,
      orderId: '',
      intervalId: '',
      attachmentOrders: []
    }
  }

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch(getAttachments());
    dispatch(getComputes());
    dispatch(getVolumes());

    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible) {
          await dispatch(getAttachments());
          await dispatch(getComputes());
          await dispatch(getVolumes());
        }
      }, env.refreshTime)
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  };

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
    if (props.attachments.loading && !_.isEqual(props.attachments.data, state.attachmentOrders)) {
      return {attachmentOrders: props.attachments.data};
    }

    return null;
  };

  render() {
    return (
      <div>
        {this.state.tableVisible ?
          (<OrderList orders={this.state.attachmentOrders} forms={[<AttachmentForm/>]}
                      disabledHeaders={['Name']} type={'attachments'} handleShow={this.handleShow}/>) :
          <AttachmentDetails id={this.state.orderId} handleHide={this.handleHide}/>
        }
      </div>
    );
  }
}

const stateToProps = state => ({
  attachments: state.attachments
});

export default connect(stateToProps)(AttachmentsPage);
