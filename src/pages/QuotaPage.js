import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import QuotaTable from '../components/QuotaTable';
import { getProviders, getProviderData, getAllProvidersData } from '../actions/providers.actions';
import { getVersion } from '../actions/version.actions';
import { getNetworkAllocation, getAllNetworkAllocation } from '../actions/networks.actions';
import { getPublicIpAllocation, getAllPublicIpAllocation } from '../actions/publicIps.actions';
import { getComputeAllocation, getAllComputeAllocation } from '../actions/computes.actions';
import { getVolumeAllocation, getAllVolumeAllocation } from '../actions/volumes.actions';
import { getLocalClouds, getCloudsByProviderId , getRemoteClouds} from '../actions/clouds.actions';

const mockData = {
  totalQuota: {
    instances: 0,
    vCPU: 0,
    ram: 0,
    storage: 0,
    volumes: 0,
    networks: 0,
    publicIps: 0
  },
  usedQuota: {
    instances: 0,
    vCPU: 0,
    ram: 0,
    storage: 0,
    volumes: 0,
    networks: 0,
    publicIps: 0
  },
  availableQuota: {
    instances: 0,
    vCPU: 0,
    ram: 0,
    storage: 0,
    volumes: 0,
    networks: 0,
    publicIps: 0
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

const mockComputeQuota = {
  instances: 0,
  vCPU: 0,
  ram: 0,
  disk: 0
};

const mockVolumeQuota = {
  instances: 0,
  storage: 0
};

const mockNetworkQuota = { instances: 0 };
const mockPublicIpQuota = { instances: 0 };

const default_cloud_index = 0;

function subtractByKey(obj1, obj2) {
  const diff = {};
  Object.keys(obj1).forEach(key => {
    if (obj2.hasOwnProperty(key)) {
      diff[key] = obj1[key] - obj2[key];
    }
  })
  return diff;
}

function sumByKey(obj1, obj2) {
  const diff = {};
  Object.keys(obj1).forEach(key => {
    if (obj2.hasOwnProperty(key)) {
      diff[key] = obj1[key] + obj2[key];
    }
  })
  return diff;
}

class QuotaPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localQuota: mockData,
      totalQuota: mockData,
      totalUsedByMe: mockQuota,
      allocatedQuota: mockQuota,
      localProvider: env.local,
      vendors: {}
    };
  }

  componentDidMount = async() => {
    const { dispatch } = this.props;
    // NOTE(pauloewerton): check whether login was successful
    if (localStorage.getItem('token')) {
      if(env.deployType !== "multi-cloud") {
        let providersResponse = await dispatch(getProviders());
        let { providers } = providersResponse;
        let totalQuota = await dispatch(getAllProvidersData(providers));
        this.setState({
          totalQuota
        });

        dispatch(getRemoteClouds(providers));

        providers.map(async(providerId) => {
          let providerClouds = await dispatch(getCloudsByProviderId(providerId));
          let cloudsCopy = JSON.parse(JSON.stringify(this.state.vendors));

          cloudsCopy[providerId] = providerClouds.clouds;
          this.setState({
            vendors: cloudsCopy
          });
        });
      }

      // local
      let localCloudResponse = await dispatch(getLocalClouds());
      let cloudNames = JSON.parse(JSON.stringify(this.state.vendors));
      let { clouds } = localCloudResponse;
      cloudNames[this.state.localProvider] = clouds;
      this.setState({
        vendors: cloudNames
      })

      let providerDataResponse = await dispatch(getProviderData(this.state.localProvider, clouds[default_cloud_index]));
      this.setState({
        localQuota: providerDataResponse.quota
      });

      if(env.deployType === "multi-cloud") {
        let totalQuota = await dispatch(getAllProvidersData([this.state.localProvider]))
        this.setState({
          totalQuota
        });
      }

      let cloudName = cloudNames[default_cloud_index];

      await this.getAllocations(this.state.localProvider, cloudName);
      await this.getTotalAllocation();
    }

    if (! this.props.version.loading) {
      dispatch(getVersion());
    }
  };

  cloudChange = async(providerId, cloudId) => {
    const { dispatch } = this.props;

    if (providerId && providerId !== '') {
      let { quota } = await dispatch(getProviderData(providerId, cloudId))
      this.setState({
        localQuota: quota
      });
      
      await this.getAllocations(providerId, cloudId);
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

  getComputeAllocationByProvider = async(provider, cloudNames) => {
    const { dispatch } = this.props;
    let computeResponse = await dispatch(getAllComputeAllocation(provider, cloudNames));
    let computeAllocations = Object.values(computeResponse.allocations);
    return computeAllocations.reduce(sumByKey);
  };

  getVolumeAllocationByProvider = async(provider, cloudNames) => {
    const { dispatch } = this.props;
    let volumeResponse = await dispatch(getAllVolumeAllocation(provider, cloudNames));
    let volumeAllocations = Object.values(volumeResponse.allocations);
    return volumeAllocations.reduce(sumByKey);
  };

  getNetworkAllocationByProvider = async(provider, cloudNames) => {
    const { dispatch } = this.props;
    let networkResponse = await dispatch(getAllNetworkAllocation(provider, cloudNames));
    let networkAllocations = Object.values(networkResponse.allocations);
    return networkAllocations.reduce(sumByKey);
  }

  getPublicIpAllocationByProvider = async(provider, cloudNames) => {
    const { dispatch } = this.props;
    let publicIpResponse = await dispatch(getAllPublicIpAllocation(provider, cloudNames));
    let publicIpAllocations = Object.values(publicIpResponse.allocations);
    return publicIpAllocations.reduce(sumByKey);
  }

  async getTotalAllocation() {
    let aggregatedCompute = { ...mockComputeQuota };
    let aggregatedVolume = { ...mockVolumeQuota };
    let aggregatedNetwork = { ...mockNetworkQuota };
    let aggregatedPublicIp = { ...mockPublicIpQuota };

    let vendors = this.state.vendors ? Object.keys(this.props.vendors) : [];

    vendors.map(async(vendor) => {
      let clouds = vendor ? this.state.vendors[vendor] : [];
      let computeAllocation = await getComputeAllocationByProvider(vendor, clouds);
      let volumeAllocation = await getVolumeAllocationByProvider(vendor, clouds);
      let networkAllocation = await getNetworkAllocationByProvider(vendor, clouds);
      let publicIpAllocation = await getPublicIpAllocationByProvider(vendor, clouds);

      aggregatedCompute = sumByKey(aggregatedCompute, computeAllocation);
      aggregatedVolume = sumByKey(aggregatedVolume, volumeAllocation);
      aggregatedNetwork = sumByKey(aggregatedNetwork, networkAllocation);
      aggregatedPublicIp = sumByKey(aggregatedPublicIp, publicIpAllocation);
    });

    let totalUsedByMe = this.buildAllocatedQuota(aggregatedCompute, aggregatedVolume, aggregatedNetwork, aggregatedPublicIp);
    this.setState({
      totalUsedByMe
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

  buildQuota(quota, allocatedQuota, aggregated=false) {
    console.log("buildQuota(quota, allocated, aggregated="+aggregated+")");
    if (aggregated) {
      console.log(allocatedQuota);
    }

    const { totalQuota, usedQuota } = quota;
    const usedByMe = { ...allocatedQuota };
    const availableQuota = subtractByKey(totalQuota, usedQuota);
    const usedByOthers = subtractByKey(quota.usedQuota, usedByMe);
  
    return {
      totalQuota,
      availableQuota,
      usedByOthers,
      usedByMe
    }
  }

  vendorChange = (provider) => {
    let cloudNames = this.state.vendors[provider];
    let cloudName = cloudNames[default_cloud_index];
    this.cloudChange(provider, cloudName);
  }

  render() {
    let localQuota = this.props.providers.loadingProvider ? this.state.localQuota : mockData;
    let localQuotaData = this.buildQuota(localQuota, this.state.allocatedQuota);
    let providerQuota = <QuotaTable vendors={this.state.vendors} vendorChange={this.vendorChange}
                                  cloudChange={this.cloudChange}
                                  data={localQuotaData}/>;

    let aggregatedQuotaData = this.buildQuota(this.state.totalQuota, this.state.totalUsedByMe, true);

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
