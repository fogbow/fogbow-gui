import React, { Component } from 'react';

import { env } from '../defaults/api.config';
import BinaryUnit from '../utils/binary.utils';
import floorTo from '../utils/math.utils';

const columns = [
  { resource: "Compute", fields: [
      { label: 'Instances', key: 'instances'},
      { label: 'vCPU', key: 'vCPU'},
      { label: 'RAM', key: 'ram'}
    ]
  },
  { resource: "Volume", fields: [
      { label: 'Instances', key: 'volumes'},
      { label: 'Storage', key: 'storage'}
    ]
  },
  { resource: "Network", fields: [{ label: 'Instances', key: 'networks'}] },
  { resource: "Public IP", fields: [{ label: 'Instances', key: 'publicIps'}] }
]

const rows = {
  sharedQuota: { label: 'Shared quota',  key: 'totalQuota' },
  availableQuota: { label: 'Available quota',  key: 'availableQuota' },
  usedByMeQuota: { label: 'Quota used by me',  key: 'allocatedQuota' },
  usedByOthersQuota: { label: 'Quota used by others',  key: 'usedByOthers' },
};

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
    let fields = this.state.columns.map(resource => resource.fields);
    let columns = [];

    fields.forEach(item => {
      item.forEach(innerItem => columns.push(innerItem));
    });

    return (
      <tr>
        {this.getFirstLabel()}
        {columns.map(field => <th key={field.key}>{field.label}</th>)}
      </tr>
    );
  };

  formatUnit = (data, unit) => {
    if (data === undefined || data == 0) return 0;

    let binaryUnit = new BinaryUnit(data, unit);
    binaryUnit.convert();
    
    if (Number.isInteger(binaryUnit.value)) 
      return binaryUnit.toString();
    else
      return floorTo(binaryUnit.value, 2) + " " + binaryUnit.unit();
  }

  formatUnits = (quota) => {
    const formattedQuota = { ... quota };
    formattedQuota.ram = this.formatUnit(quota.ram, "MB");
    formattedQuota.storage = this.formatUnit(quota.storage, "GB");
    return formattedQuota;
  };

  getRow = (row, data, quota) => {
    if (!quota) quota = data[row.key];
    const rowData = this.formatUnits(quota);
    return (
      <tr key={row.key}>
        <td>{row.label}</td>
        {this.getCells(rowData)}
      </tr>
    );
  };

  getRows = () => {
    let data = this.props.data;

    let sharedQuotaRow = this.getRow(rows.sharedQuota, data);
    let availableQuotaRow = this.getRow(rows.availableQuota, data);
    let usedByMeQuotaRow = this.getRow(rows.usedByMeQuota, data);

    const usedByOthers = {
      instances: data.usedQuota.instances - data.allocatedQuota.instances,
      ram: data.usedQuota.ram - data.allocatedQuota.ram,
      vCPU: data.usedQuota.vCPU - data.allocatedQuota.vCPU,
      volumes: data.usedQuota.volumes - data.allocatedQuota.volumes,
      storage: data.usedQuota.storage - data.allocatedQuota.storage,
      networks: data.usedQuota.networks - data.allocatedQuota.networks,
      publicIps: data.usedQuota.publicIps - data.allocatedQuota.publicIps
    };

    let usedByOthersQuotaRow = this.getRow(rows.usedByOthersQuota, data, usedByOthers);

    // return this.state.rows
    //   .map(row => {
    //     return(
    //       <tr key={row.label}>
    //         <td key={row.label}>{row.label}</td>
    //         {this.getCells(data[row.key])}
    //       </tr>
    //     );
    // });

    return [sharedQuotaRow, availableQuotaRow, usedByMeQuotaRow, usedByOthersQuotaRow];
  };

  getCells = (row) => {
    let fields = this.state.columns.map(resource => resource.fields);
    let cells = [];

    fields.forEach(item => {
      item.forEach(innerItem => cells.push(innerItem.key));
    });

    // let cells = this.state.columns.map(col => col.key);
    return cells.map((key, index) => {
      return (row[key] && row[key] != -1) ? <td key={key}>{row[key]}</td> : <td key={index}>-</td>
    });
  };

  getHeaderGroup = () => {
    return this.state.columns.map(item => {
      return <th colSpan={item.fields.length}>{item.resource}</th>
    });
  };

  render() {
    return (
      <div className='table-responsive'>
        <table className="table table-striped table-bordered table-hover">
          <thead>
          <tr>
            <th></th>
            {this.getHeaderGroup()}
          </tr>
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
