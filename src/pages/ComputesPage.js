import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import ComputeForm from '../components/ComputeForm';
import { getComputes } from '../actions/computes.actions';

class ComputesPage extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getComputes())
    };

    get computes() {
        return this.props.computes.loading ? this.props.computes.data: [];
    }

    handleShow = (orderId) => {
        console.log(orderId);
    }

    render() {
        return (
            <OrderList orders={this.computes} form={<ComputeForm/>} 
            type={'computes'} handleShow={this.handleShow}/>
        );
    }
}

const stateToProps = state => ({
    computes: state.computes
});

export default connect(stateToProps)(ComputesPage);