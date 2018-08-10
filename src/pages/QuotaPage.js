import React, { Component } from 'react';

import QuotaTable from '../components/QuotaTable';

class QuotaPage extends Component {    
    render() {
        return (
            <div>
                <QuotaTable label="Local"/>
                <QuotaTable label="Aggregated"/>
            </div>
        );
    }
}

export default QuotaPage;
