import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        this.setState({
            intervalId: setInterval(async() => {
                await dispatch(getAttachments());
            }, 5000)
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
    }

    render() {
        return (
            <div>
                {this.state.tableVisible ?
                    (<OrderList orders={this.attachments} form={<AttachmentForm/>}  
                    type={'attachments'} handleShow={this.handleShow}/>):
                    <AttachmentDetails id={this.state.orderId}/>
                }
            </div>
        );
    }
}

const stateToProps = state => ({
    attachments: state.attachments
});

export default connect(stateToProps)(AttachmentsPage);