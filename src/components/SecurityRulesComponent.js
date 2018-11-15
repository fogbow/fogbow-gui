import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { deletePublicIpSecurityRule } from '../actions/publicIps.actions';
import { deleteNetworkSecurityRule } from '../actions/networks.actions';
import '../styles/sidebar.css';

const headers = [
  'Direction', 'Ether Type', 'IP Protocol', 'Port Range', 'CIDR', 'Action'
];

class SecurityRulesComponent extends Component {
  getHeaders = () => {
    return(
      <tr>
        {headers.map(header => { return <th scope='col' key={header}>{header}</th> })}
      </tr>
    );
  };

  getRows = () => {
    return this.props.securityRules.map(securityRule => {
      return (
        <tr key={securityRule.instanceId}>
          <td>{securityRule.direction}</td>
          <td>{securityRule.etherType}</td>
          <td>{securityRule.protocol}</td>
          <td>{securityRule.portFrom === securityRule.portTo ?
               securityRule.portFrom :
               securityRule.portFrom + '-' + securityRule.portTo}
          </td>
          <td>{securityRule.cidr}</td>
          <td>
            <button type='button' className='btn btn-sm btn-danger' onClick={this.handleDelete}>
              Delete Rule
            </button>
          </td>
        </tr>
      );
    });
  };

  handleDelete = async(event) => {
    event.preventDefault();

    // NOTE(pauloewerton): get security rule id from parent tr element.
    const { key } = event.target.parentNode.parentNode;
    const { dispatch } = this.props;

    try {
      if (this.props.orderType === 'network') {
        await dispatch(deleteNetworkSecurityRule(key, this.props.orderId));
      } else if (this.props.orderType === 'publicIp') {
        await dispatch(deletePublicIpSecurityRule(key, this.props.orderId));
      } else {
        throw(new Error('Wrong order type.'));
      }

      toast.success('Security rule id: ' + key + ' deleted successfully.');
      event.target.parentNode.parentNode.style.visibility = 'hidden';
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <table className='table table-responsive table-sm table-striped'>
        <thead>
          {this.getHeaders()}
        </thead>
        <tbody>
          {this.getRows()}
        </tbody>
      </table>
    );
  }
}

export default connect()(SecurityRulesComponent);
