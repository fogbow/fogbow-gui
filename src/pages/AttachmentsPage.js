import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import { getAttachments } from '../actions/attachments.actions';
import AttachmentForm from '../components/AttachmentForm';

class AttachmentsPage extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getAttachments())
    };

    get attachments() {
        return this.props.attachments.loading ? this.props.attachments.data: [];
    } 

    render() {
        return (
            <OrderList orders={this.attachments} form={<AttachmentForm/>}  />
        );
    }
}

const stateToProps = state => ({
    attachments: state.attachments
});

export default connect(stateToProps)(AttachmentsPage);