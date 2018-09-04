import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import QuotaTable from '../components/QuotaTable';
import { getMembers, getMemberData } from '../actions/members.actions';

const mockData = { 
    totalQuota: { 
        vCPU: 0,
        ram: 0,
        instances: 0
    },
    usedQuota: { 
        vCPU: 0,
        ram: 0,
        instances: 0
    },
    availableQuota: { 
        vCPU: 0,
        ram: 0,
        instances: 0
    } 
};

class QuotaPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quota: mockData,
            selectedUserQuota: mockData,
            localMember: env.local
        };
    }

    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getMembers());
    };

    vendorChange = (event) => {
        event.preventDefault();
        const { dispatch } = this.props;
        let id = event.target.value;

        dispatch(getMemberData(id))
            .then(data => {
                this.setState({
                    selectedUserQuota: data.quota
                });
            });
    };

    render() {
        let memberQuota = this.props.members.loading ?
                            <QuotaTable vendors={this.props.members.data}
                                vendorChange={this.vendorChange}
                                data={this.props.members.loadingMember ? this.state.selectedUserQuota: mockData}/> :
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
    members: state.members,
    quota: state.quota
});

export default connect(stateToProps)(QuotaPage);
