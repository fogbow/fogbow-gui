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

const default_cloud_index = 0;

class QuotaPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localQuota: mockData,
      totalQuota: mockData,
      localMember: env.local,
      vendors: {}
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch(getMembers())
      .then(data => {
        dispatch(getAllMembersData(data.members))
          .then(data => {
            this.setState({
              totalQuota: data
            });
          });

        data.members.map(async(memberId) => {
          let memberClouds = await dispatch(getCloudsByMemberId(memberId));
          let cloudsCopy = JSON.parse(JSON.stringify(this.state.vendors));

          cloudsCopy[memberId] = memberClouds.clouds;
          this.setState({
            vendors: cloudsCopy
          });
        });
      });

    // local
    dispatch(getLocalClouds())
      .then(data => dispatch(getMemberData(this.state.localMember, data.clouds[default_cloud_index])))
      .then(data => {
        this.setState({
          localQuota: data.quota
        });
      });

    if (! this.props.version.loading) {
      dispatch(getVersion());
    }
  };

  cloudChange = (memberId, cloudId) => {
    const { dispatch } = this.props;

    if (memberId && memberId !== '') {
      dispatch(getMemberData(memberId, cloudId))
        .then(data => {
          this.setState({
            localQuota: data.quota
          });
        });
    } else {
      this.setState({
        localQuota: mockData
      });
    }
  };

  render() {
    let memberQuota = <QuotaTable vendors={this.state.vendors} vendorChange={this.vendorChange}
                                  cloudChange={this.cloudChange}
                                  data={this.props.members.loadingMember ? this.state.localQuota :
                                        mockData}/>;

    return (
        <div>
          {this.state.vendors[env.local] ? memberQuota : undefined}
          <QuotaTable label="Aggregated" data={this.props.members.loadingMember ?
                                               this.state.totalQuota : mockData}/>
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
