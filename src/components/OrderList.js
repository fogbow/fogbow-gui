import React, { Component } from 'react';

import OrderComponent from './OrderComponent';
import { connect } from 'react-redux';

const headers = [
  'ID', 'Name', 'Provider', 'State', 'Actions'
];

class OrderList extends Component {
  constructor(props) {
    super(props);

    // NOTE(pauloewerton): allowed values for disabled headers are the same as in the 'headers'
    // list above, except for ID and Actions.
    const filteredHeaders = this.props.disabledHeaders ?
                            headers.filter(h => this.props.disabledHeaders.indexOf(h) === -1) :
                            headers;

    this.state = {
      headers: filteredHeaders,
      orderName: '',
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

  filteredOrders = () => {
    let filter = this.state.orderName;
    return this.props.orders.filter(order => {
      return order.id.includes(filter) ||
        order.provider.includes(filter) ||
        order.state.includes(filter);
    });
  };

  getLines = () => {
    return this.props.orders.map(order => {
      const actions = this.props.actionsByOrder ? this.props.actionsByOrder[order.id] : []
      return(
        <OrderComponent key={order.instanceId} order={order}
                        disabledHeaders={this.props.disabledHeaders}
                        handleShow={() => this.props.handleShow(order.instanceId)}
                        type={this.props.type}
                        actions={actions}/>
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
    const forms = this.props.forms.map((form, idx) => <div key={idx}>{form}</div>);

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse">
            <form className="form-inline ml-auto my-2 my-lg-0">
              <input value={this.state.orderName} type="search" onChange={this.handleChange}
                     name="orderName" placeholder="Search" className="form-control mr-sm-2 my-2"/>

              <button type="button" className="btn btn-btn-dark my-2 my-sm-0"
                      data-toggle="modal" data-target="#form">Create</button>

              <div>
                {forms}
              </div>
            </form>
            </div>
          </nav>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              {this.getHeaders()}
            </thead>
            <tbody>
              {this.getLines()}
            </tbody>
          </table>
      </div>
    );
  }
}

export default connect()(OrderList);
