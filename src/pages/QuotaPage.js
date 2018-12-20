import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import QuotaTable from '../components/QuotaTable';
import { getMembers, getMemberData, getAllMembersData } from '../actions/members.actions';
import { getLocalClouds, getCloudsByMemberId } from '../actions/clouds.actions';
import { getVersion } from '../actions/version.actions';

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
      localQuota: mockData,
      totalQuota: mockData,
      selectedUserQuota: mockData,
      localMember: env.local
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;

    // aggregated
    dispatch(getMembers())
      .then(data => {
        dispatch(getAllMembersData(data.members))
          .then(data => {
            this.setState({
              totalQuota: data
            });
          })
      });

    // local
    dispatch(getLocalClouds())
      .then(data => dispatch(getMemberData(this.state.localMember, data.clouds[0])))
      .then(data => {
        this.setState({
          localQuota: data.quota
        });
      });

    if (! this.props.version.loading) {
      dispatch(getVersion());
    }
  };

  vendorChange = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    let id = event.target.value;

    if (id && id !== '') {
      dispatch(getMemberData(id))
        .then(data => {
          this.setState({
            selectedUserQuota: data.quota
          });
        });
    } else {
      this.setState({
        selectedUserQuota: mockData
      });
    }
  };

  render() {
    let memberQuota = this.props.members.loading ?
                      <QuotaTable vendors={this.props.members.data} vendorChange={this.vendorChange}
                                  data={this.props.members.loadingMember ? this.state.selectedUserQuota :
                                        mockData}/> :
                      undefined;

    return (
        <div>
          <QuotaTable label={env.local + ' (local)'}
                      data={this.props.members.loadingMember ? this.state.localQuota: mockData}/>
          <QuotaTable label="Aggregated" data={this.props.members.loadingMember ?
                                               this.state.totalQuota : mockData}/>
          {memberQuota}
        </div>
    );
  }
}

const stateToProps = state => ({
  members: state.members,
  clouds: state.clouds,
  quota: state.quota,
  version: state.version
});

export default connect(stateToProps)(QuotaPage);
