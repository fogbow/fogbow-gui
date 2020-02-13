import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import QuotaTable from '../components/QuotaTable';
import { getProviders, getProviderData, getAllProvidersData } from '../actions/providers.actions';
import { getVersion } from '../actions/version.actions';
import { getNetworkAllocation, getAllNetworkAllocation } from '../actions/networks.actions';
import { getPublicIpAllocation } from '../actions/publicIps.actions';
import { getComputeAllocation, getAllComputeAllocation } from '../actions/computes.actions';
import { getVolumeAllocation, getAllVolumeAllocation } from '../actions/volumes.actions';
import { getLocalClouds, getCloudsByProviderId , getRemoteClouds} from '../actions/clouds.actions';

const mockData = {
    "totalQuota": {
        "instances": 0,
        "vCPU": 0,
        "ram": 0,
        "storage": 0,
        "networks": 0,
        "publicIps": 0
    },
    "usedQuota": {
        "instances": 0,
        "vCPU": 0,
        "ram": 0,
        "storage": 0,
        "networks": 0,
        "publicIps": 0
    },
    "availableQuota": {
        "instances": 0,
        "vCPU": 0,
        "ram": 0,
        "storage": 0,
        "networks": 0,
        "publicIps": 0
    }
}

const mockAllocationQuota = {
  "allocatedQuota": {
      "instances": 0,
      "vCPU": 0,
      "ram": 0,
      "storage": 0,
      "networks": 0,
      "publicIps": 0
  }
}

const mockQuota = {
  instances: 0,
  vCPU: 0,
  ram: 0,
  storage: 0,
  volumes: 0,
  networks: 0,
  publicIps: 0
};

const mockComputeAllocation = {
  instances: 0,
  vCPU: 0,
  ram: 0,
  disk: 0
}

const mockVolumeAllocation = {
  instances: 0,
  storage: 0
}

const mockNetworkAllocation = {
  networks: 0
}

const mockPublicIpAllocation = {
  publicIps: 0
}


const default_cloud_index = 0;

class QuotaPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localQuota: mockData,
      totalQuota: mockData,
      aggregatedQuota: mockQuota,
      temp: {},
      computeAllocation: mockComputeAllocation,
      volumeAllocation: mockVolumeAllocation,
      networkAllocation: mockNetworkAllocation,
      publicIpAllocation: mockPublicIpAllocation,
      allocatedQuota: mockAllocationQuota,
      localProvider: env.local,
      vendors: {}
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    // NOTE(pauloewerton): check whether login was successful
    // NOTE(jadsonluan): remember to implement quota requests for remote clouds too
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

          let cloudNames = this.state.vendors[this.state.localProvider];
          return cloudNames;
        })
        .then(cloudNames => {
          let cloudName = cloudNames[default_cloud_index];
          this.getAllocations(this.state.localProvider, cloudName)
            .then(() => {
              this.getAggregatedAllocations(this.state.localProvider, cloudNames);
            })
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

      this.getAllocations(providerId, cloudId);
    } else {
      this.setState({
        localQuota: mockData
      });
    }
  };

  buildAllocatedQuota(computeAllocation, volumeAllocation, networkAllocation, publicIpAllocation) {
    return {
      instances: computeAllocation.instances,
      ram: computeAllocation.ram,
      vCPU: computeAllocation.vCPU,
      volumes: volumeAllocation.instances,
      storage: volumeAllocation.storage,
      networks: networkAllocation.instances,
      publicIps: publicIpAllocation.instances
    };
  }

  async getAggregatedAllocations(provider, cloudNames) {
    const { dispatch } = this.props;

    let computeResponse = await dispatch(getAllComputeAllocation(provider, cloudNames));
    let computeAllocations = Object.values(computeResponse.allocations);
    let computeAllocation = computeAllocations.reduce((previous, current) => ({
      instances: previous.instances + current.instances,
      vCPU: previous.vCPU + current.vCPU,
      ram: previous.ram + current.ram,
      disk: previous.disk + current.disk,
    }));

    let volumeResponse = await dispatch(getAllVolumeAllocation(provider, cloudNames));
    let volumeAllocations = Object.values(volumeResponse.allocations);
    let volumeAllocation = volumeAllocations.reduce((previous, current) => ({
      instances: previous.instances + current.instances,
      storage: previous.storage + current.storage
    }));

    let networkResponse = await dispatch(getAllNetworkAllocation(provider, cloudNames));
    let networkAllocations = Object.values(networkResponse.allocations);
    let networkAllocation = networkAllocations.reduce((previous, current) => ({
      instances: previous.instances + current.instances
    }));

    let publicIpResponse = await dispatch(getAllPublicIpAllocation(provider, cloudNames));
    let publicIpAllocations = Object.values(publicIpResponse.allocations);
    let publicIpAllocation = publicIpAllocations.reduce((previous, current) => ({
      instances: previous.instances + current.instances
    }));

    let aggregatedQuota = this.buildAllocatedQuota(computeAllocation, volumeAllocation, networkAllocation, publicIpAllocation);
    this.setState({
      aggregatedQuota
    })
  }

  async getAllocations(provider, cloudId) {
    const { dispatch } = this.props;

    const computeResponse = await dispatch(getComputeAllocation(provider, cloudId));
    const computeAllocation = computeResponse.allocation;

    const volumeResponse = await dispatch(getVolumeAllocation(provider, cloudId));
    const volumeAllocation = volumeResponse.allocation;

    const networkResponse = await dispatch(getNetworkAllocation(provider, cloudId));
    const networkAllocation = networkResponse.allocation;

    const publicIpResponse = await dispatch(getPublicIpAllocation(provider, cloudId));
    const publicIpAllocation = publicIpResponse.allocation;

    const allocatedQuota = this.buildAllocatedQuota(computeAllocation, volumeAllocation, networkAllocation, publicIpAllocation);
    this.setState({ allocatedQuota });
  };

  render() {
    let quota = this.props.providers.loadingProvider ? this.state.localQuota : mockData;
    const allocatedQuota = this.state.allocatedQuota;
    let data = {
      ...quota,
      allocatedQuota
    }

    let providerQuota = <QuotaTable vendors={this.state.vendors} vendorChange={this.vendorChange}
                                  cloudChange={this.cloudChange}
                                  data={data}/>;

    let aggregatedQuota = this.state.aggregatedQuota;
    let aggregatedQuotaData = {
      ... mockData,
      allocatedQuota: aggregatedQuota
    }

    return (
        <div>
          {this.state.vendors[env.local] ? providerQuota : undefined}
          <QuotaTable label="Aggregated" data={aggregatedQuotaData}/>
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
