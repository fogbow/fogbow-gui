import React, { Component } from 'react';

import QuotaTable from '../components/QuotaTable';

const mockData = { 
    totalQuota: { 
        vCPU: 28,
        ram: 73728,
        instances: 11
    },
    usedQuota: { 
        vCPU: 0,
        ram: 0,
        instances: 0
    },
    availableQuota: { 
        vCPU: 28,
        ram: 73728,
        instances: 11
    } 
};

class QuotaPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quota: mockData,
            selectedUserQuota: mockData
        };
    }
    

    vendorChange = (event) => {
        event.preventDefault();
        // TODO: Here we will get data.
    };

    render() {
        return (
            <div>
                <QuotaTable label="Local" data={this.state.quota}/>
                <QuotaTable label="Aggregated" data={this.state.quota}/>
                <QuotaTable vendors={['naf1', 'naf2']} 
                    vendorChange={this.vendorChange} 
                    data={this.state.selectedUserQuota}/>
            </div>
        );
    }
}

export default QuotaPage;
