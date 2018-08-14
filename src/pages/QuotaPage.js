import React, { Component } from 'react';
import { connect } from 'react-redux';

import QuotaTable from '../components/QuotaTable';
import { getMembers } from '../actions/members.actions';

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

    componentDidMount = () => {
        this.getVendors();
    };

    getVendors = () => {
        const { dispatch } = this.props;
        dispatch(getMembers());
    }
    

    vendorChange = (event) => {
        event.preventDefault();
    };

    render() {
        let memberQuota = this.props.members.loading ?
                            <QuotaTable vendors={this.props.members.data}
                                vendorChange={this.vendorChange}
                                data={this.state.selectedUserQuota}/> :
                            undefined;

        return (
            <div>
                <QuotaTable label="Local" data={this.state.quota}/>
                <QuotaTable label="Aggregated" data={this.state.quota}/>
                {memberQuota}
            </div>
        );
    }
}

const stateToProps = state => ({
    members: state.members
});

export default connect(stateToProps)(QuotaPage);
