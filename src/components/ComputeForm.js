import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { getImages, getRemoteImages, createCompute } from '../actions/computes.actions';
import { getNetworks, getFedNetworks } from '../actions/networks.actions';

import '../styles/order-form.css';

const scriptTypes = [
  'text/x-shellscript',
  'text/x-include-url',
  'text/upstart-job',
  'text/cloud-config',
  'text/cloud-boothook'
];

const initialState = {
  name: '',
  providingMember: env.local,
  imageId: '',
  vCPU: 1,
  disk: 30,
  memory: 1024,
  networksId: '',
  federatedNetworkId: '',
  file: '',
  scriptType: scriptTypes[0],
  publicKey: ''
};

class ComputeForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = () => {
    let { dispatch } = this.props;
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

    if (name === 'networksId') {
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

  handleSubmit = (event) => {
    event.preventDefault();

    let body = _.pickBy(this.state, _.identity);

    if(!body.file)
      delete body.scriptType;

    body = { federatedNetworkId: body.federatedNetworkId, computeOrder: body };
    delete body.computeOrder.federatedNetworkId;

    let { dispatch } = this.props;
    dispatch(createCompute(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  render() {
    let localImages = this.props.images.loading ? this.props.images.data : undefined;
    let remoteImages = this.props.remoteImages.loading ? this.props.remoteImages.data : undefined;
    let images = this.state.providingMember === env.local ? localImages :
      remoteImages[this.state.providingMember];

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
                     type="number" name="vCPU" min="1"/>

              <label>Minimal Amount of RAM (MB)</label>
              <input value={this.state.memory} onChange={this.handleChange} className="form-control"
                     type="number" name="memory" min="1"/>

              <label>Providing Member</label>
              <select value={this.state.providingMember} onChange={this.handleChange}
                      name='providingMember' className="form-control">
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

              <label>Image</label>
              <select value={this.state.imageId} onChange={this.handleChange} name='imageId'
                      className="form-control">
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
              <select value={this.state.networksId} onChange={this.handleChange}
                      name='networksId' className="form-control">
                  <option value=''>Choose a network</option>
                  {
                    this.props.networks.loading ?
                    this.props.networks.data.map((network, idx) => {
                      return network.provider === this.state.providingMember ?
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

              <label>Extra User File</label>
              <input value={this.state.file} onChange={this.handleChange} type="file"
                    className="form-control" name="file"/>

              <label>Extra User Data File Type</label>
              <select value={this.state.scriptType} onChange={this.handleChange} name='scriptType'
                      className="form-control">
                  <option value=''></option>
                  { scriptTypes.map((type, idx) => <option key={idx} value={type}>{type}</option>) }
              </select>

              <label>Public Key</label>
              <textarea value={this.state.publicKey} onChange={this.handleChange}
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
  images: state.images,
  remoteImages: state.remoteImages,
  networks: state.networks,
  fednets: state.fedNetworks
});

export default connect(stateToProps)(ComputeForm);
