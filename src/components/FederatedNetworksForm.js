import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { createFedNetwork } from '../actions/networks.actions';

const initialState = {
  name: '',
  cidr: '188.140.0.0/24',
  providers: [],
  mode: ''
};

class FederatedNetworksForm extends Component {
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

  handleAddProvider = (event) => {
    let value = event.target.value;
    let providers = this.state.providers;

    if(!providers.includes(value)) {
      this.setState({
          providers: providers.concat([value])
      });
    } else {
      this.setState({
          providers: providers.filter(provider => provider !== value)
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let body = _.pickBy(this.state, _.identity);

    let { dispatch } = this.props;
    dispatch(createFedNetwork(body));
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
              <h5 className="modal-title" id="exampleModalLabel">Create Federated Network</h5>
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
              <input className="form-control" type="text" name="cidr"
                     value={this.state.cidr} onChange={this.handleChange}/>

              <label>Providers</label>
              {
                this.props.providers.data.map((provider, idx) => {
                  return(
                    <div key={idx}>
                      <label>
                        <input type="checkbox" value={provider} onChange={this.handleAddProvider}/>
                        { provider }
                      </label>
                    </div>
                  );
                })
              }

              <label>FNS Mode</label>
              <select value={this.state.fnsModes} onChange={this.handleChange}
                      name='mode' className='form-control'>
                <option value=''>Choose a mode</option>
                { env.fnsModes.map((mode, idx) => <option key={idx} value={mode}>{mode}</option>) }
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
                      onClick={this.resetForm}>
                Close
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal"
                      onClick={this.handleSubmit}>
                Create Federated Network
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
});

export default connect(stateToProps)(FederatedNetworksForm);
