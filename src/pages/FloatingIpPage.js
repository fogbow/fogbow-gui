import React, { Component } from 'react';
import { connect } from 'react-redux';


import OrderList from '../components/OrderList';
import FloatingIpForm from '../components/FloatingIpForm';
import { getFloatIps } from '../actions/floatIps.actions';

class FloatingIpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableVisible: true,
            orderId: ''
        }
    }

    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getFloatIps());
    };

    get floatingIps() {
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
                <OrderList orders={[]} form={<FloatingIpForm/>}  
                    type={'floatip'} handleShow={this.handleShow} handleHide={this.handleHide}/>
            </div>
        );
    }
}

export default connect()(FloatingIpPage);