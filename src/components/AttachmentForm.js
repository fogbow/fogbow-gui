import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { getComputes } from '../actions/computes.actions';
import { getVolumes } from '../actions/volumes.actions';
import { createAttachment } from '../actions/attachments.actions';

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
    if(! this.props.computes.loading) {
        dispatch(getComputes());
    }
    if(! this.props.volumes.loading) {
        dispatch(getVolumes());
    }
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

    body['cloudName'] = this.cloudName.value;

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

              <label>Compute ID</label>
              <select name='computeId' className='form-control' value={this.state.computeId}
                      onChange={this.handleChange}>
                <option value=''></option>
                {
                  this.props.computes.loading ?
                  this.props.computes.data
                    .filter(compute => compute.state === 'READY' &&
                                       compute.provider === this.state.provider &&
                                       compute.cloudName === this.state.cloudName)
                    .map((compute, idx) =>
                      <option key={idx} value={compute.instanceId}>{compute.instanceId}</option>) :
                  undefined
                }
              </select>

              <label>Volume ID</label>
              <select name='volumeId' className='form-control' value={this.state.volumeId}
                      onChange={this.handleChange}>
                <option value=''></option>
                {
                  this.props.volumes.loading ?
                  this.props.volumes.data
                    .filter(volume => volume.state === 'READY' &&
                                      volume.provider === this.state.provider &&
                                      volume.cloudName === this.state.cloudName)
                    .map((volume, idx) =>
                      <option key={idx} value={volume.instanceId}>{volume.instanceId}</option>) :
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
