import React, { Component } from 'react';

class OrderComponent extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.order.id}</td>
                <td>{this.props.order.provider}</td>
                <td>{this.props.order.state}</td>
                <td>Test Content</td>
            </tr>
        );
    }
}

export default OrderComponent;