import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import '../styles/details.css';

import { env } from '../defaults/api.config';
import { createPublicIp } from '../actions/publicIps.actions';

const initialState = {
  provider: env.local,
  computeId: '',
  computes: [],
};

class PublicIpForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = (event) => {
    let { name, value } = event.target;

    this.setState({
        [name]: value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    let { dispatch } = this.props;
    let body = _.pickBy(this.state, _.identity);

    delete body.provider;

    dispatch(createPublicIp(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  static getDerivedStateFromProps = (props, state) => {
    if (props.computes.loading && !_.isEqual(props.computes.data, state.computes)) {
      return {computes: props.computes.data};
    }

    return null;
  };

  render() {
    let remoteClouds = this.props.remoteClouds.loading ? this.props.remoteClouds.data : undefined;
    let clouds = remoteClouds ? remoteClouds[this.state.provider] : remoteClouds;

    return (
      <div className="modal fade" id="form" tabIndex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Public IP</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                      onClick={this.resetForm}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Provider</label>
              <select name='provider' className="form-control" required
                      value={this.state.provider} onChange={this.handleChange}>
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
                      className='form-control' onInput={this.handleChange} required>
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
              <select name='computeId' className="form-control" required
                      value={this.state.computeId} onChange={this.handleChange}>
                <option value=''></option>
                {
                  this.state.computes && this.cloudName ?
                  this.state.computes
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
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
                      onClick={this.resetForm}>
                Close
              </button>
              <button type="button" className="btn btn-primary"  data-dismiss="modal"
                      onClick={this.handleSubmit}>
                Create Public IP
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
  computes: state.computes
});

export default connect(stateToProps)(PublicIpForm);
