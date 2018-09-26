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

    get floatIps() {
        console.log(this.props.floatIps);
        
        return this.props.floatIps.loading ? this.props.floatIps.data: [];
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
                <OrderList orders={this.floatIps} form={<FloatingIpForm/>}  
                    type={'floatip'} handleShow={this.handleShow} handleHide={this.handleHide}/>
            </div>
        );
    }
}

const stateToProps = state => ({
    floatIps: state.floatIps
});

export default connect(stateToProps)(FloatingIpPage);