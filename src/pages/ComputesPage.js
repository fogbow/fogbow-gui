import React, { Component } from 'react';

import OrderList from '../components/OrderList';

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
    

    render() {
        return (
            <OrderList orders={this.state.orders}/>
        );
    }
}

export default ComputesPage;