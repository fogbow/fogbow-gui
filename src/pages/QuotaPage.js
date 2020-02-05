import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import QuotaTable from '../components/QuotaTable';
import { getProviders, getProviderData, getAllProvidersData } from '../actions/providers.actions';
import { getLocalClouds, getCloudsByProviderId , getRemoteClouds} from '../actions/clouds.actions';
import { getVersion } from '../actions/version.actions';

const mockData = {
    "totalQuota": {
        "instances": 0,
        "vCPU": 0,
        "ram": 0,
        "disk": 0,
        "networks": 0,
        "publicIps": 0
    },
    "usedQuota": {
        "instances": 0,
        "vCPU": 0,
        "ram": 0,
        "disk": 0,
        "networks": 0,
        "publicIps": 0
    },
    "availableQuota": {
        "instances": 0,
        "vCPU": 0,
        "ram": 0,
        "disk": 0,
        "networks": 0,
        "publicIps": 0
    }
}

const default_cloud_index = 0;

class QuotaPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localQuota: mockData,
      totalQuota: mockData,
      localProvider: env.local,
      vendors: {}
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    // NOTE(pauloewerton): check whether login was successful
    if (localStorage.getItem('token')) {
      console.log(this.props);
      if(env.deployType !== "basic-site") {
        dispatch(getProviders())
        .then(data => {
          dispatch(getAllProvidersData(data.providers))
            .then(data => {
              this.setState({
                totalQuota: data
              });
            });

          dispatch(getRemoteClouds(data.providers));

          data.providers.map(async(providerId) => {
            let providerClouds = await dispatch(getCloudsByProviderId(providerId));
            let cloudsCopy = JSON.parse(JSON.stringify(this.state.vendors));

            cloudsCopy[providerId] = providerClouds.clouds;
            this.setState({
              vendors: cloudsCopy
            });
          });
        });
      }

      // local
      dispatch(getLocalClouds())
        .then(data => {
          let cloudsCopy = JSON.parse(JSON.stringify(this.state.vendors));
          cloudsCopy[this.state.localProvider] = data.clouds;
          this.setState({
            vendors: cloudsCopy
          })
          return dispatch(getProviderData(this.state.localProvider, data.clouds[default_cloud_index]))
        })
        .then(data => {
          this.setState({
            localQuota: data.quota
          });

          if(env.deployType === "basic-site") {
            this.setState({
              totalQuota: data.quota
            })
          }
        });
    }

    if (! this.props.version.loading) {
      dispatch(getVersion());
    }
  };

  cloudChange = (providerId, cloudId) => {
    const { dispatch } = this.props;

    if (providerId && providerId !== '') {
      dispatch(getProviderData(providerId, cloudId))
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
    let providerQuota = <QuotaTable vendors={this.state.vendors} vendorChange={this.vendorChange}
                                  cloudChange={this.cloudChange}
                                  data={this.props.providers.loadingProvider ? this.state.localQuota :
                                        mockData}/>;

    return (
        <div>
          {this.state.vendors[env.local] ? providerQuota : undefined}
          <QuotaTable label="Aggregated" data={this.props.providers.loadingProvider ?
                                               this.state.totalQuota : mockData}/>
        </div>
    );
  }
}

const stateToProps = state => ({
  providers: state.providers,
  clouds: state.clouds,
  remoteClouds: state.remoteClouds,
  quota: state.quota,
  version: state.version
});

export default connect(stateToProps)(QuotaPage);
