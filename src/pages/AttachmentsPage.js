import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import { getAttachments } from '../actions/attachments.actions';
import AttachmentForm from '../components/AttachmentForm';
import AttachmentDetails from '../components/AttachmentDetails';

class AttachmentsPage extends Component {
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
    dispatch(getAttachments());
    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible)
          await dispatch(getAttachments());
      }, env.refreshTime)
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  };

  get attachments() {
    return this.props.attachments.loading ? this.props.attachments.data: [];
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
          (<OrderList orders={this.attachments} form={<AttachmentForm/>}
                      type={'attachments'} handleShow={this.handleShow}/>) :
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
