import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { getRemoteClouds } from '../actions/clouds.actions';
import { getImages, getRemoteImages, createCompute } from '../actions/computes.actions';
import { getNetworks, getFedNetworks } from '../actions/networks.actions';

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
  networkIds: '',
  federatedNetworkId: '',
  scriptType: '',
  publicKey: ''
};

class ComputeForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = () => {
    let { dispatch } = this.props;

    if(! this.props.remoteClouds.loading) {
      if (this.props.members.loading) {
        dispatch(getRemoteClouds(this.props.members.data));
      }
    }
    if(! this.props.images.loading) {
      dispatch(getImages());
    }
    if(! this.props.remoteImages.loading) {
      if (this.props.members.loading) {
        dispatch(getRemoteImages(this.props.members.data));
      }
    }
    if(! this.props.networks.loading) {
      dispatch(getNetworks());
    }
    if(! this.props.fednets.loading) {
      dispatch(getFedNetworks());
    }
  };

  handleChange = (event) => {
    let { name, value } = event.target;

    if (name === 'networkIds') {
      // FIXME(pauloewerton): this will work only with a single network id
      this.setState({
          [name]: [value]
      });
    } else {
      this.setState({
          [name]: value
      });
    }
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

    body = { federatedNetworkId: body.federatedNetworkId, computeOrder: body };


    if (this.fileContent.files.item(0)) {
      const tag = this.fileContent.value.indexOf('\\') !== -1 ? this.fileContent.value.split('\\') :
                this.fileContent.value.split('/');

      try {
        const userDataContent = await this.readUserDataFile(this.fileContent.files.item(0));
        body.computeOrder['userData'] = [{
          extraUserDataFileContent: userDataContent,
          extraUserDataFileType: body.computeOrder.scriptType,
          tag: tag[tag.length - 1]
        }];
      } catch(error) {
        console.log(error);
      }
    }

    delete body.computeOrder.federatedNetworkId;
    delete body.computeOrder.fileContent;
    delete body.computeOrder.scriptType;

    let { dispatch } = this.props;
    dispatch(createCompute(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
    this.fileContent.value = '';
  };

  render() {
    let localImages = this.props.images.loading ? this.props.images.data : undefined;
    let remoteImages = this.props.remoteImages.loading ? this.props.remoteImages.data : undefined;
    let images = this.state.provider === env.local ? localImages : remoteImages[this.state.provider];

    let localClouds = this.props.clouds.loading ? this.props.clouds.data : undefined;
    let remoteClouds = this.props.remoteClouds.loading ? this.props.remoteClouds.data : undefined;
    let clouds = this.state.provider === env.local ? localClouds : remoteClouds[this.state.member];

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
                     type="number" name="vCPU" min="1" required />

              <label>Minimal Amount of Disk (GB)</label>
              <input value={this.state.disk} onChange={this.handleChange} className="form-control"
                     type="number" name="disk" min="1" required />

              <label>Minimal Amount of RAM (MB)</label>
              <input value={this.state.memory} onChange={this.handleChange} className="form-control"
                     type="number" name="memory" min="1" required />

              <label>Provider</label>
              <select value={this.state.provider} onChange={this.handleChange}
                      name='provider' className="form-control" required>
                {
                  this.props.members.loading ?
                  this.props.members.data.map((member, idx) => {
                    if (member === env.local) {
                      return <option key={idx} value={member} defaultValue>{member} (local)</option>;
                    }
                    return <option key={idx} value={member}>{member}</option>;
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
                      return <option key={idx} value={cloud}>{cloud}</option>;
                    }) :
                    undefined
                }
              </select>

              <label>Image</label>
              <select value={this.state.imageId} onChange={this.handleChange} name='imageId'
                      className="form-control" required>
                <option value=''>Choose an image</option>
                {
                  images ?
                  Object.keys(images)
                      .map((image, idx) =>
                        <option key={idx} value={image}>{images[image]}</option>) :
                  undefined
                }
              </select>

              <label>Network ID</label>
              <select value={this.state.networkIds} onChange={this.handleChange}
                      name='networkIds' className="form-control">
                <option value=''>Choose a network</option>
                {
                  this.props.networks.loading ?
                  this.props.networks.data.map((network, idx) => {
                    return network.provider === this.state.provider ?
                      <option key={idx} value={network.instanceId}>
                        {network.instanceId}
                      </option> :
                      undefined; }) :
                  undefined
                }
              </select>

              <label>Federated Network ID</label>
              <select value={this.props.federatedNetworkId} onChange={this.handleChange}
                      name='federatedNetworkId' className="form-control">
                <option value=''>Choose a federated network</option>
                {
                  this.props.fednets.loading ?
                  this.props.fednets.data.map((network, idx) =>
                    <option key={idx} value={network.instanceId}>{network.instanceId}</option>) :
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
              <textarea value={this.state.publicKey} onChange={this.handleChange} cols="50" rows="5"
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
  members: state.members,
  clouds: state.clouds,
  remoteClouds: state.remoteClouds,
  images: state.images,
  remoteImages: state.remoteImages,
  networks: state.networks,
  fednets: state.fedNetworks
});

export default connect(stateToProps)(ComputeForm);
