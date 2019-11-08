import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { createNetwork } from '../actions/networks.actions';

const initialState = {
  name: '',
  cidr: '10.10.0.0/24',
  gateway: '10.10.0.1',
  allocationMode: 'dynamic',
  provider: env.local,
}

class NetworkForm extends Component {
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

    body['cloudName'] = this.cloudName.value;

    dispatch(createNetwork(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  getClouds = () => {
    let remoteClouds = this.props.remoteClouds.loading ? this.props.remoteClouds.data : undefined;
    let clouds = remoteClouds ? remoteClouds[this.state.provider] : undefined;

    if(env.deployType === "basic-site" && !clouds) {
      clouds = this.props.clouds.data;
    }

    return clouds;
  };

  render() {
    let clouds = this.getClouds();

    return (
      <div className="modal fade" id="form" tabIndex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Network</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                      onClick={this.resetForm}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Name</label>
              <input value={this.state.name} onChange={this.handleChange} className="form-control"
                     type="text" name="name"/>

              <label>CIDR</label>
              <input className="form-control" type="text" name="cidr" value={this.state.cidr}
                     onChange={this.handleChange}/>

              <label>Gateway</label>
              <input className="form-control" type="text" name="gateway" value={this.state.gateway}
                     onChange={this.handleChange}/>

              <label>Allocation Mode</label>
              <select name='allocationMode' className="form-control" value={this.state.allocationMode}
                      onChange={this.handleChange}>
                  <option value='dynamic'>Dynamic</option>
                  <option value='static'>Static</option>
              </select>

              <label>Provider</label>
              <select name='provider' className="form-control" value={this.state.provider}
                      onChange={this.handleChange}>
                {
                  this.props.providers.loading ?
                  this.props.providers.data.map((provider, idx) => {
                    if (provider === env.local) {
                      return <option key={idx} value={provider} defaultValue>{provider} (local)</option>;
                    }
                    return <option key={idx} value={provider}>{provider}</option>;
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
                      onClick={this.resetForm}>
                Close
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal"
                      onClick={this.handleSubmit}>
                Create Network
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
});

export default connect(stateToProps)(NetworkForm);
