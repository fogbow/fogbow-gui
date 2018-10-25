import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import '../styles/details.css';

import { env } from '../defaults/api.config';
import { getComputes } from '../actions/computes.actions';
import { createPublicIp } from '../actions/publicIps.actions';

const initialState = {
  provider: env.local,
  computeId: '',
};

class PublicIpForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = () => {
    let { dispatch } = this.props;
    if(! this.props.computes.loading) {
        dispatch(getComputes());
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
    dispatch(createPublicIp(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  render() {
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
              <label>Providing Member</label>
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

              <label>Compute ID</label>
              <select name='computeId' className="form-control" required
                  value={this.state.computeId} onChange={this.handleChange}>
                  <option value=''></option>
                  {
                    this.props.computes.loading ?
                    this.props.computes.data
                      .filter(compute => compute.state === 'READY' &&
                                         compute.provider === this.state.provider)
                      .map((compute, idx) =>
                        <option key={idx} value={compute.instanceId}>{compute.instanceId}</option>):
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
  computes: state.computes
});

export default connect(stateToProps)(PublicIpForm);
