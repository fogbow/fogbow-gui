import React, { Component } from 'react';

import QuotaTable from '../components/QuotaTable';

class QuotaPage extends Component {
    render() {
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
        return (
            <div>
                <QuotaTable label="Local" data={mockData}/>
                <QuotaTable label="Aggregated" data={mockData}/>
            </div>
        );
    }
}

export default QuotaPage;
