import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import QuotaTable from '../components/QuotaTable';
import { getProviders, getProviderData, getAllProvidersData } from '../actions/providers.actions';
import { getVersion } from '../actions/version.actions';
import { getNetworkAllocation } from '../actions/networks.actions';
import { getPublicIpAllocation } from '../actions/publicIps.actions';
import { getComputeAllocation } from '../actions/computes.actions';
import { getVolumeAllocation } from '../actions/volumes.actions';
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

          let localCloudsCopy = this.state.vendors[this.state.localProvider];
          return dispatch(getComputeAllocation(this.state.localProvider, localCloudsCopy[default_cloud_index]));
        })
        .then(data => {
          console.log("SADSAD");
          console.log(data);
          
          this.setState({
            computeAllocation: data.allocation
          })

          let localCloudsCopy = this.state.vendors[this.state.localProvider];
          return dispatch(getVolumeAllocation(this.state.localProvider, localCloudsCopy[default_cloud_index]));
        })
        .then(data => {
          this.setState({
            volumeAllocation: data.allocation
          })
        })
        .then(() => {
          const computeAllocation = this.state.computeAllocation;
          const volumeAllocation = this.state.volumeAllocation;

          console.log(computeAllocation);
          console.log(volumeAllocation);

          const allocatedQuota = {
            instances: computeAllocation.instances,
            ram: computeAllocation.ram,
            vCPU: computeAllocation.vCPU,
            volumes: volumeAllocation.instances,
            storage: volumeAllocation.storage,
            networks: 0,
            publicIps: 0
          };

          this.setState({
            allocatedQuota
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

      dispatch(getComputeAllocation(this.state.localProvider, cloudId))
      .then(data => {
        console.log("SADSAD");
        console.log(data);
        
        this.setState({
          computeAllocation: data.allocation
        })

        return dispatch(getVolumeAllocation(this.state.localProvider, cloudId));
      })
      .then(data => {
        this.setState({
          volumeAllocation: data.allocation
        })

        return dispatch(getNetworkAllocation(this.state.localProvider, cloudId));
      })
      .then(data => {
        this.setState({
          networkAllocation: data.allocation
        })

        return dispatch(getPublicIpAllocation(this.state.localProvider, cloudId));
      })
      .then(data => {
        this.setState({
          publicIpAllocation: data.allocation
        })
      })
      .then(() => {
        const computeAllocation = this.state.computeAllocation;
        const volumeAllocation = this.state.volumeAllocation;
        const networkAllocation = this.state.networkAllocation;
        const publicIpAllocation = this.state.publicIpAllocation;

        console.log(computeAllocation);
        console.log(volumeAllocation);

        const allocatedQuota = {
          instances: computeAllocation.instances,
          ram: computeAllocation.ram,
          vCPU: computeAllocation.vCPU,
          volumes: volumeAllocation.instances,
          storage: volumeAllocation.storage,
          networks: networkAllocation.instances,
          publicIps: publicIpAllocation.instances
        };

        this.setState({
          allocatedQuota
        })
      });
    } else {
      this.setState({
        localQuota: mockData
      });
    }
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
    return (
        <div>
          {this.state.vendors[env.local] ? providerQuota : undefined}
          <QuotaTable label="Aggregated" data={data}/>
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
