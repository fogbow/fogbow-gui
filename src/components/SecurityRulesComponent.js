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
  constructor(props) {
    super(props);
    this.state = {rows: this.getRows()};
  }

  getHeaders = () => {
    return(
      <tr>
        {headers.map(header => { return <th scope='col' key={header}>{header}</th> })}
      </tr>
    );
  };

  getRows = () => {
    return Object.values(this.props.securityRules).map(securityRule => {
      let port = securityRule.portFrom === securityRule.portTo ? securityRule.portFrom :
                 securityRule.portFrom + '-' + securityRule.portTo;
      port = port === 0 ? 'Any' : port;

      return (
        <tr key={securityRule.id}>
          <td>{securityRule.direction === 'IN' ? 'Ingress' : 'Egress'}</td>
          <td>{securityRule.etherType}</td>
          <td>{securityRule.protocol === 'ANY' ? 'Any' : securityRule.protocol}</td>
          <td>{port}</td>
          <td>{securityRule.cidr || '-'}</td>
          <td>
            <button type='button' className='btn btn-sm btn-danger' onClick={this.handleDelete}
                    value={securityRule.id}>
              Delete Rule
            </button>
          </td>
        </tr>
      );
    });
  };

  handleDelete = async(event) => {
    event.preventDefault();

    const id = event.target.value;
    const { dispatch } = this.props;

    try {
      const deleteFunc = this.props.orderType === 'network' ? deleteNetworkSecurityRule :
                         deletePublicIpSecurityRule;

      await dispatch(deleteFunc(id, this.props.orderId));
      toast.success('Security rule ' + id + ' deleted successfully.');

      const rowsCopy = [...this.state.rows];

      for (let i = 0; i < rowsCopy.length; i++) {
        if (rowsCopy[i].key === id) {
          rowsCopy.splice(rowsCopy.indexOf(rowsCopy[i]), 1);
          this.setState({rows: rowsCopy});
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <table className='table table-responsive table-sm table-striped security-rules'>
        <thead>
          {this.getHeaders()}
        </thead>
        <tbody>
          {this.state.rows || '-'}
        </tbody>
      </table>
    );
  }
}

export default connect()(SecurityRulesComponent);
