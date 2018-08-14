import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import { getComputes } from '../actions/computes.actions';

const ordersMock = [
    { id: '1', provider: 'naf2', state: 'FULLFIELD'},    
    { id: '2', provider: 'naf2', state: 'FULLFIELD'},
    { id: '3', provider: 'naf2', state: 'FULLFIELD'},
    { id: '4', provider: 'naf2', state: 'FULLFIELD'}
];


class ComputesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: ordersMock
        };
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getComputes())
    };

    render() {
        return (
            <OrderList orders={this.state.orders}/>
        );
    }
}

const stateToProps = state => ({
    computes: state.computes
});

export default connect(stateToProps)(ComputesPage);