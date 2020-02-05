import React, { Component } from 'react';

import { env } from '../defaults/api.config';

const columns = [
  { label: 'Instance', key: 'instances'},
  { label: 'vCPU', key: 'vCPU'},
  { label: 'RAM', key: 'ram'},
  { label: 'Volume', key: 'volumes'},
  { label: 'Storage', key: 'disk'},
  { label: 'FIP', key: 'publicIps'},
  { label: 'Network', key: 'networks' }
];

const rows = [
  { label: 'Total quota',  key: 'totalQuota' },
  { label: 'Available quota',  key: 'availableQuota' },
  { label: 'Quota used by me',  key: 'usedQuota' },
];

class QuotaTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows,
      columns,
      vendor: env.local,
      cloud: ''
    }
  }

  handleChange = (event) => {
    let { name, value } = event.target;

    this.setState({
        [name]: value
    });
  };

  cloudChange = (event) => {
    let { value } = event.target;

    this.handleChange(event);
    this.props.cloudChange(this.state.vendor, value);
  };

  getFirstLabel = () => {
    let label = this.props.label;

    if (label) {
      return <th key={label}>{label}</th>
    } else {
      let vendors = this.props.vendors ? Object.keys(this.props.vendors) : [];
      let clouds = this.props.vendors ? this.props.vendors[this.state.vendor] : [];

      return(
        <th>
          <div className='row'>
            <div className='col pl-0'>
              <div className='col'>
                <div className='form-row'>
                  <div className='col'>
                    <label className='mr-2'>Provider</label>
                    <select value={this.state.vendor} name='vendor' onChange={this.handleChange}>
                      {
                        vendors.length > 0 ?
                          vendors.map((vendor, idx) => {
                            if (vendor === env.local) {
                              return <option key={idx} value={vendor} defaultValue>{vendor} (local)</option>;
                            }
                            return <option key={idx} value={vendor}>{vendor}</option>;
                          }) :
                          undefined
                      }
                    </select>
                  </div>
                </div>
              </div>

              <div className='col'>
                <div className='form-row'>
                  <div className='col'>
                    <label className='mr-2'>Cloud</label>
                    <select value={this.state.cloud} onChange={this.cloudChange} name='cloud'>
                      <option value=''></option>
                      {
                        clouds.length > 0 ?
                          clouds.map((cloud, idx) => {
                            if (idx === 0) {
                              return <option key={idx} value={cloud} defaultValue>{cloud}</option>;
                            }
                            return <option key={idx} value={cloud}>{cloud}</option>;
                          }) :
                          undefined
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </th>
      );
    }
  };

  getHeaders = () => {
    let columns = this.state.columns.map(col => col.label);

    return (
      <tr>
        {this.getFirstLabel()}
        {columns.map(header => <th key={header}>{header}</th>)}
      </tr>
    );
  };

  getRows = () => {
    let data = this.props.data;
    return this.state.rows
      .map(row => {
        return(
          <tr key={row.label}>
            <td key={row.label}>{row.label}</td>
            {this.getCells(data[row.key])}
          </tr>
        );
    });
  };

  getCells = (row) => {
    let cells = this.state.columns.map(col => col.key);
    return cells.map((key, index) => {
      return row[key] ? <td key={key}>{row[key]}</td> : <td key={index}>-</td>
    });
  };

  render() {
    return (
      <div className='table-responsive'>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            {this.getHeaders()}
          </thead>
          <tbody>
            {this.getRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default QuotaTable;
