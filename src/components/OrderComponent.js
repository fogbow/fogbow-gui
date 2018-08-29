import React, { Component } from 'react';

class OrderComponent extends Component {
    render() {
        return (
            <tr>
                <td><a href="http://github.com/fogbow">{this.props.order.instanceId}</a></td>
                {this.props.disableProvider ? undefined:
                    <td>{this.props.order.provider}</td>}
                <td>{this.props.order.state}</td>
                <td>Test Content</td>
            </tr>
        );
    }
}

export default OrderComponent;