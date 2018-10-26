import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/details.css';

import { getAttachmentData } from '../actions/attachments.actions';

class AttachmentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: {}
    }
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch(getAttachmentData(this.props.id)).then(data => {
      this.setState({
        orderData: data.attachments
      });
    })
  }

  render() {
    return (
      <div className="details">
        <button type="button" className="close" aria-label="Close"
                onClick={() => this.props.handleHide()}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h2>Attachment Details</h2>
        <hr className="horizontal-line"/>

        <p className="bolder">ID</p>
        <p>{this.state.orderData.id || '-'}</p>

        <p className="bolder">State</p>
        <p>{this.state.orderData.state || '-'}</p>

        <p className="bolder">Compute</p>
        <p>Name: {this.state.orderData.computeName || '-'}</p>
        <p>ID: {this.state.orderData.computeId || '-'}</p>

        <p className="bolder">Volume</p>
        <p>Name: {this.state.orderData.volumeName || '-'}</p>
        <p>ID: {this.state.orderData.volumeId || '-'}</p>

        <p className="bolder">Device</p>
        <p>{this.state.orderData.device || '-'}</p>
      </div>
    );
  }
}

export default connect()(AttachmentDetails);
