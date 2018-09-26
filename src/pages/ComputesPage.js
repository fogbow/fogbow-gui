import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import ComputeForm from '../components/ComputeForm';
import { getComputes } from '../actions/computes.actions';
import ComputeDatails from '../components/ComputeDatails';

class ComputesPage extends Component {
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
        dispatch(getComputes());
        this.setState({
            intervalId: setInterval(async() => {
                await dispatch(getComputes());
            }, 5000)
        });
    };

    componentWillUnmount = () => {
        clearInterval(this.state.intervalId);
    }

    get computes() {
        return this.props.computes.loading ? this.props.computes.data: [];
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

    render() {
        return (
            <div>
                {this.state.tableVisible ? 
                (<OrderList orders={this.computes} form={<ComputeForm/>} 
                    type={'computes'} handleShow={this.handleShow}/>):
                <ComputeDatails id={this.state.orderId} handleHide={this.handleHide}/>}
            </div>
        );
    }
}

const stateToProps = state => ({
    computes: state.computes
});

export default connect(stateToProps)(ComputesPage);