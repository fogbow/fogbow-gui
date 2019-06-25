import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { getComputes } from '../actions/computes.actions';
import { getVolumes } from '../actions/volumes.actions';
import { createAttachment } from '../actions/attachments.actions';

import '../styles/order-form.css';

const initialState = {
  provider: env.local,
  computeId: '',
  volumeId: '',
  device: '/dev/sdb'
};

class AttachmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = () => {
    let { dispatch } = this.props;

    dispatch(getComputes());
    dispatch(getVolumes());
  };

  handleChange = (event) => {
    let { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let body = _.pickBy(this.state, _.identity);
    let { dispatch } = this.props;

    delete body.provider;

    dispatch(createAttachment(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  render() {
    let remoteClouds = this.props.remoteClouds.loading ? this.props.remoteClouds.data : undefined;
    let clouds = remoteClouds ? remoteClouds[this.state.provider] : remoteClouds;

    return (
      <div className='modal fade' id='form' tabIndex='-1' role='dialog'
           aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>Create Attachment</h5>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'
                      onClick={this.resetForm}>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <label>Provider</label>
              <select name='provider' className='form-control' value={this.state.provider}
                      onChange={this.handleChange}>
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
              <select ref={ref => this.cloudName = ref} onChange={this.handleChange} name='cloudName'
                      className='form-control' required>
                <option value=''></option>
                {
                  clouds ?
                    clouds.map((cloud, idx) => {
                      if (idx === 0) {
                        return <option key={idx} value={cloud} defaultValue>{cloud + ' (default)'}</option>;
                      }
                      return <option key={idx} value={cloud}>{cloud}</option>;
                    }) :
                    undefined
                }
              </select>

              <label>Compute Name/ID</label>
              <select name='computeId' className='form-control name-id-pair' value={this.state.computeId}
                      onChange={this.handleChange}>
                <option value=''></option>
                {
                  this.props.computes.loading && this.cloudName ?
                  this.props.computes.data
                    .filter(compute => compute.state === 'READY' &&
                                       compute.provider === this.state.provider &&
                                       compute.cloudName === this.cloudName.value)
                    .map((compute, idx) =>
                      <option key={idx} value={compute.instanceId}>
                        {compute.instanceName.concat(' (', compute.instanceId, ')')}
                      </option>) :
                  undefined
                }
              </select>

              <label>Volume Name/ID</label>
              <select name='volumeId' className='form-control name-id-pair' value={this.state.volumeId}
                      onChange={this.handleChange}>
                <option value=''></option>
                {
                  this.props.volumes.loading && this.cloudName ?
                  this.props.volumes.data
                    .filter(volume => volume.state === 'READY' &&
                                      volume.provider === this.state.provider &&
                                      volume.cloudName === this.cloudName.value)
                    .map((volume, idx) =>
                      <option key={idx} value={volume.instanceId}>
                        {volume.instanceName.concat(' (' , volume.instanceId, ')')}
                      </option>) :
                  undefined
                }
              </select>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-dismiss='modal'
                      onClick={this.resetForm}>
                Close
              </button>
              <button type='button' className='btn btn-primary' data-dismiss='modal'
                      onClick={this.handleSubmit}>
                Create Attachment
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
  computes: state.computes,
  volumes: state.volumes
});

export default connect(stateToProps)(AttachmentForm);
