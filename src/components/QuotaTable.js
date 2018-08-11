import React, { Component } from 'react';

const columns = [
    { label: 'Instance', key: 'instances'},
    { label: 'vCPU', key: 'vCPU'},
    { label: 'RAM', key: 'ram'},
    { label: 'Volume', key: 'volumes'},
    { label: 'Storage', key: 'storages'},
    { label: 'FIP', key: 'fips'},
    { label: 'Network', key: 'networks' }
];

const rows = [
    { label: 'Shared quota',  key: 'totalQuota' },
    { label: 'Available quota',  key: 'availableQuota' },
    { label: 'Quota used by me',  key: 'usedQuota' },
];

class QuotaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows,
            columns
        }
    }

    getHeaders = () => {
        let columns = this.state.columns.map(col => col.label);

        return [this.props.label]
            .concat(columns)
            .map(header => <th key={header}>{header}</th>);
    };

    
    getRolls = () => {
        let data = this.props.data;
        return this.state.rows
        .map(row => {
            return(
                <tr key={row.label}>
                    <td key={row.label}>{row.label}</td>
                    {this.getCells(row.label, data[row.key])}
                </tr>
            );
        });
    };

    getCells = (label, row) => {
        let cells = this.state.columns.map(col => col.key);
        return cells.map((key, index) => {
            return row[key] ? 
                    <td key={key}>{row[key]}</td>:
                    <td key={index}>-</td>
            });
    };

    render() {
        return (
            <div>
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            {this.getHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.getRolls()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default QuotaTable;