import React, { Component } from 'react';

const columns = [
    'Instance', 'vCPU', 'RAM', 'Volume', 'Storage', 'FIP', 'Network'
];

class QuotaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns
        }
    }

    getHeaders = () => {
        return [this.props.label]
            .concat(this.state.columns)
            .map(header => <th key={header}>{header}</th>);
    };

    render() {
        return (
            <div>
                <table>
                    <tr>
                        {this.getHeaders()}
                    </tr>
                </table>
            </div>
        );
    }
}

export default QuotaTable;