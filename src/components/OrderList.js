import React, { Component } from 'react';

import OrderComponent from './OrderComponent';
import ComputeForm from './ComputeForm';

const headers = [
    'id', 'Provider', 'State', 'Actions'
];

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers,
            orderName: ''
        };
    }
    

    getHeaders = () => {
        this.state.headers = this.props.disableProvider ?
            headers.filter(h => h !== 'Provider'): headers;
        return(
            <tr>
                {this.state.headers
                    .map(header => {
                        return <th key={header}>{header}</th> 
                })}
            </tr>
        );
    };

    filteredOrders = () => {
        let filter = this.state.orderName;
        return this.props.orders.filter(order => {
            return order.id.includes(filter) ||
                order.provider.includes(filter) ||
                order.state.includes(filter);
        });
    };

    getLines = () => {
        return this.props.orders
            .map(order => {
                return(
                    <OrderComponent key={order.instanceId} order={order} type={this.props.type}
                        disableProvider={this.props.disableProvider}/>
                );
            });
    };

    handleChange = (event) => {
        let { name, value } = event.target;
        
        this.setState({
            [name]: value
        });
    };
    
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse">
                        <form className="form-inline ml-auto my-2 my-lg-0">
                            <input value={this.state.orderName} type="search" onChange={this.handleChange} name="orderName"
                                placeholder="Search" className="form-control mr-sm-2 my-2"/>

                            <button type="button" className="btn btn-btn-dark my-2 my-sm-0" data-toggle="modal" data-target="#form">Create</button>

                            <div>
                                {this.props.form}
                            </div>
                        </form>
                    </div>
                </nav>
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        {this.getHeaders()}
                    </thead>
                    <tbody>
                        {this.getLines() || undefined }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default OrderList;