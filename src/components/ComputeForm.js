import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { getRemoteClouds } from '../actions/clouds.actions';
import { getRemoteImages, createCompute, getImages } from '../actions/computes.actions';
import { getNetworks, getFedNetworks } from '../actions/networks.actions';
import RequirementsComponent from './RequirementsComponent';

import '../styles/order-form.css';

const scriptTypes = [
  'CLOUD_BOOTHOOK',
  'CLOUD_CONFIG',
  'INCLUDE_URL',
  'PART_HANDLER',
  'SHELL_SCRIPT',
  'UPSTART_JOB'
];

const initialState = {
  name: '',
  provider: env.local,
  cloudName: '',
  imageId: '',
  vCPU: 1,
  disk: 20,
  memory: 1024,
  networkIds: [],
  federatedNetworkId: '',
  scriptType: '',
  publicKey: '',
  requirements: {},
  requirementTag: '',
  requirementValue: '',
};

class ComputeForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = async() => {
    let { dispatch } = this.props;

    if (! this.props.remoteClouds.loading && env.deployType !== "multi-cloud") {
      dispatch(getRemoteClouds(this.props.providers));
    }

    if (! this.props.remoteImages.loading && env.deployType !== "multi-cloud") {
      dispatch(getRemoteImages(this.props.remoteClouds.data));
    }

    if(! this.props.images.loading && env.deployType === "multi-cloud") {
      dispatch(getImages(this.state.provider, this.props.clouds.data));
    }

    if (! this.props.networks.loading) {
      dispatch(getNetworks());
    }

    if (! this.props.fednets.loading && env.deployType === "federation") {
      dispatch(getFedNetworks());
    }
  };

  handleChange = (event) => {
    let { name, value } = event.target;

    if (name === 'networkIds') {
      let networkIds = this.state.networkIds || [];

      if (networkIds.includes(value)) {
        networkIds.pop(value);
      } else {
        networkIds.push(value);
      }

      this.setState({
        'networkIds': networkIds
      });
    } else {
      this.setState({
          [name]: value
      });
    }
  };

  handleRequirementTagChange = (newRequirementTag) => {
    this.setState({
      requirementTag: newRequirementTag
    });
  };

  handleRequirementValueChange = (newRequirementValue) => {
    this.setState({
      requirementValue: newRequirementValue
    });
  };

  addRequirement = (event) => {
    event.preventDefault();

    const requirementsCopy = JSON.parse(JSON.stringify(this.state.requirements));
    requirementsCopy[this.state.requirementTag] = this.state.requirementValue;

    this.setState({
      requirements: requirementsCopy
    });
  };

  resetRequirements = (event) => {
    event.preventDefault();

    this.setState({
      requirementTag: '',
      requirementValue: '',
      requirements: {}
    });
  };

  readUserDataFile = (userDataFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const content = btoa(unescape(encodeURIComponent(reader.result)));
        resolve(content)
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(userDataFile);
    });
  };

  handleSubmit = async(event) => {
    event.preventDefault();

    let body = _.pickBy(this.state, _.identity);

    body = { federatedNetworkId: body.federatedNetworkId, compute: body };

    if (this.fileContent.files.item(0)) {
      const tag = this.fileContent.value.indexOf('\\') !== -1 ? this.fileContent.value.split('\\') :
                  this.fileContent.value.split('/');

      try {
        const userDataContent = await this.readUserDataFile(this.fileContent.files.item(0));
        body.compute['userData'] = [{
          extraUserDataFileContent: userDataContent,
          extraUserDataFileType: body.compute.scriptType,
          tag: tag[tag.length - 1]
        }];
      } catch(error) {
        console.log(error);
      }
    }

    delete body.compute.federatedNetworkId;
    delete body.compute.fileContent;
    delete body.compute.scriptType;
    delete body.compute.requirementTag;
    delete body.compute.requirementValue;

    if(env.deployType !== "federation") {
      body = body.compute;
    }

    let { dispatch } = this.props;
    dispatch(createCompute(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
    this.fileContent.value = '';
  };

  getClouds = () => {
    let remoteClouds = this.props.remoteClouds.loading ? this.props.remoteClouds.data : undefined;
    let clouds = remoteClouds ? remoteClouds[this.state.provider] : undefined;

    if(env.deployType === "multi-cloud" && !clouds) {
      clouds = this.props.clouds.data;
    }

    return clouds;
  };

  getProviders = () => {
    let providers = this.props.providers.loading ? this.props.providers.data : undefined;;
    if(env.deployType === "multi-cloud" && !providers) {
      providers = [this.state.provider];
    }
    return providers;
  };

  render() {
    let clouds = this.getClouds();
    let providers = this.getProviders();
    let remoteImages = this.props.remoteImages.loading ? this.props.remoteImages.data : undefined;
    let images = remoteImages && remoteImages.hasOwnProperty(this.state.provider) &&
                  remoteImages[this.state.provider].hasOwnProperty(this.state.cloudName) ?
                  remoteImages[this.state.provider][this.state.cloudName] : undefined;
        
    if(env.deployType === "multi-cloud" && !images) {
      let localImages = this.props.images.loading && this.props.images.data[this.state.cloudName];
      images = localImages;
    }

    return (
      <div className="modal fade" id="form" tabIndex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Compute</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                      onClick={this.resetForm}>
              <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Name</label>
              <input value={this.state.name} onChange={this.handleChange} className="form-control"
                     type="text" name="name"/>

              <label>Minimal Number of vCPUs</label>
              <input value={this.state.vCPU} onChange={this.handleChange} className="form-control"
                     type="number" name="vCPU" min="0" required />

              <label>Minimal Amount of Disk (GB)</label>
              <input value={this.state.disk} onChange={this.handleChange} className="form-control"
                     type="number" name="disk" min="0" required />

              <label>Minimal Amount of RAM (MB)</label>
              <input value={this.state.memory} onChange={this.handleChange} className="form-control"
                     type="number" name="memory" min="0" required />

              <label>Provider</label>
              <select value={this.state.provider} onChange={this.handleChange}
                      name='provider' className="form-control" required>
                {
                  providers ?
                  providers.map((provider, idx) => {
                    if (provider === env.local) {
                      return <option key={idx} value={provider} defaultValue>{provider} (local)</option>;
                    }
                    return <option key={idx} value={provider}>{provider}</option>;
                  }) :
                  undefined
                }
              </select>

              <label>Cloud</label>
              <select value={this.state.cloudName} onChange={this.handleChange} name='cloudName'
                      className='form-control' required>
                <option value=''>Choose a cloud name</option>
                {
                  clouds ?
                    clouds.map((cloud, idx) => {
                      return <option key={idx} value={cloud}>
                              {cloud + (idx === 0 ? ' (default)' : '')}
                             </option>;
                    }) :
                    undefined
                }
              </select>

              <label>Image</label>
              <select value={this.state.imageId} onChange={this.handleChange} name='imageId'
                      className='form-control name-id-pair' required>
                <option value=''>Choose an image</option>
                {
                  images ?
                  images.map((image, idx) =>
                        <option key={image.id} value={image.id}>
                          {image.name.concat(' (', image.id, ')')}
                        </option>) : undefined
                }
              </select>

              <RequirementsComponent requirements={this.state.requirements}
                                     requirementTag={this.state.requirementTag}
                                     requirementValue={this.state.requirementValue}
                                     onRequirementTagChange={this.handleRequirementTagChange}
                                     onRequirementValueChange={this.handleRequirementValueChange}
                                     onAddRequirement={this.addRequirement}
                                     onResetRequirements={this.resetRequirements}/>

              <label>Network ID(s)</label>
              <fieldset className="checkbox-list">
                { !this.state.provider || !this.state.cloudName ? <label>No cloud or provider selected</label> : undefined }
                { this.props.networks.loading ?
                  this.props.networks.data.map((network, idx) => {
                    return network.provider === this.state.provider &&
                           network.cloudName === this.state.cloudName ?
                      <div className="checkbox-field">
                        <input onChange={this.handleChange} type="checkbox" id={idx} value={network.instanceId} name="networkIds"></input>
                        <label htmlFor={idx}>{network.instanceId}</label>
                      </div> : undefined
                      ; }) :
                  undefined
                }
              </fieldset>

              <label>Federated Network ID</label>
              <select value={this.state.federatedNetworkId} onChange={this.handleChange}
                      name='federatedNetworkId' className="form-control">
                <option value=''>Choose a federated network</option>
                {
                  this.props.fednets.loading ?
                  this.props.fednets.data.map((network, idx) =>
                    <option key={idx} value={network.instanceId}>
                      {network.instanceName.concat(' (', network.instanceId, ')')}
                    </option>) :
                  undefined
                }
              </select>

              <label>User Data File Type</label>
              <select value={this.state.scriptType} onChange={this.handleChange}
                      name='scriptType' className="form-control">
                <option value=''>Choose a file type</option>
                { scriptTypes.map((type, idx) => <option key={idx} value={type}>{type}</option>) }
              </select>

              <label>User Data File</label>
              <input onChange={this.handleChange} type="file" ref={(ref) => this.fileContent = ref}
                     className="form-control" name="fileContent" />

              <label>Public Key</label>
              <textarea value={this.state.publicKey} onChange={this.handleChange} cols="45" rows="5"
                        className="form-control" name="publicKey"></textarea>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
                      onClick={this.resetForm}>
                Close
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal"
                      onClick={this.handleSubmit}>
                Create Compute
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  providers: state.providers,
  clouds: state.clouds,
  remoteClouds: state.remoteClouds,
  images: state.images,
  remoteImages: state.remoteImages,
  networks: state.networks,
  fednets: state.fedNetworks
});

export default connect(stateToProps)(ComputeForm);
