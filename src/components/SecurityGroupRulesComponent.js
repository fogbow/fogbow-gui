import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { deletePublicIpSecurityGroupRule } from '../actions/publicIps.actions';
import { deleteNetworkSecurityGroupRule } from '../actions/networks.actions';
import '../styles/sidebar.css';

const headers = [
  'Direction', 'Ether Type', 'IP Protocol', 'Port Range', 'CIDR', 'Action'
];

class SecurityGroupRulesComponent extends Component {
  getHeaders = () => {
    return(
      <tr>
        {headers.map(header => { return <th scope='col' key={header}>{header}</th> })}
      </tr>
    );
  };

  getRows = () => {
    return this.props.securityGroupRules.map(securityGroupRule => {
      return (
        <tr key={securityGroupRule.instanceId}>
          <td>{securityGroupRule.direction}</td>
          <td>{securityGroupRule.etherType}</td>
          <td>{securityGroupRule.protocol}</td>
          <td>{securityGroupRule.portFrom === securityGroupRule.portTo ?
               securityGroupRule.portFrom :
               securityGroupRule.portFrom + '-' + securityGroupRule.portTo}
          </td>
          <td>{securityGroupRule.cidr}</td>
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

    // Get security rule id from parent tr element
    const { key } = event.target.parentNode.parentNode;
    const { dispatch } = this.props;

    try {
      if (this.props.orderType === 'network') {
        await dispatch(deleteNetworkSecurityGroupRule(key, this.props.orderId));
      } else if (this.props.orderType === 'publicIp') {
        await dispatch(deletePublicIpSecurityGroupRule(key, this.props.orderId));
      } else {
        throw(new Error('Wrong order type.'));
      }

      toast.success('Security group rule id: ' + key + ' deleted successfully.');
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

export default connect()(SecurityGroupRulesComponent);
