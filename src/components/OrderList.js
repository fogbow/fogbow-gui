import React, { Component } from 'react';

import OrderComponent from './OrderComponent';

const headers = [
    'id', 'Provider', 'State', 'Actions'
];

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers
        };
    }
    

    getHeaders = () => {
        return(
            <tr>
                {this.state.headers
                    .map(header => {
                        return <th key={header}>{header}</th> 
                })}
            </tr>
        );
    };

    getLines = () => {
        return this.props.orders
            .map(order => {
                return(
                    <OrderComponent key={order.id} order={order}/>
                );
            });
    };
    
    render() {
        return (
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    {this.getHeaders()}
                </thead>
                <tbody>
                    {this.getLines() || undefined }
                </tbody>
            </table>
        );
    }
}

export default OrderList;