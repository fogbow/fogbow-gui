import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { env } from '../defaults/api.config';
import { getRemoteClouds } from '../actions/clouds.actions';
import { createVolume } from '../actions/volumes.actions';
import RequirementsComponent from './RequirementsComponent';

const initialState = {
  name: '',
  size: 1,
  provider: env.local,
  requirements: {},
  requirementTag: '',
  requirementValue: '',
};

class VolumeForm extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

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
  }

  componentDidMount = () => {
    let { dispatch } = this.props;

    if(! this.props.remoteClouds.loading) {
      if (this.props.providers.loading) {
        dispatch(getRemoteClouds(this.props.providers.data));
      }
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

    delete body.requirementTag;
    delete body.requirementValue;

    body['cloudName'] = this.cloudName.value;

    dispatch(createVolume(body));
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
                <h5 className='modal-title' id='exampleModalLabel'>Create Volume</h5>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'
                        onClick={this.resetForm}>
                  <span aria-hidden='true'>&times;</span>
                </button>
            </div>

            <div className='modal-body needs-validation'>
              <div className='form-row'>
                <div className='col'>
                  <label>Name</label>
                  <input className='form-control' type='text' name='name'
                          value={this.state.name} onChange={this.handleChange}/>
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>Volume Size (GB)</label>
                  <input className='form-control' type='number' name='size'
                         value={this.state.size} onChange={this.handleChange} min='1'
                         required />
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>Provider</label>
                  <select name='provider' className='form-control' required
                          value={this.state.provider} onChange={this.handleChange}>
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
                </div>
              </div>

              <RequirementsComponent requirements={this.state.requirements}
                                     requirementTag={this.state.requirementTag}
                                     requirementValue={this.state.requirementValue}
                                     onRequirementTagChange={this.handleRequirementTagChange}
                                     onRequirementValueChange={this.handleRequirementValueChange}
                                     onAddRequirement={this.addRequirement}
                                     onResetRequirements={this.resetRequirements}/>
              <div className='form-row'>
                <div className='col'>
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
              </div>
            </div>

            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-dismiss='modal'
                      onClick={this.resetForm}>
                Close
              </button>
              <button type='button' className='btn btn-primary' data-dismiss='modal'
                      onClick={this.handleSubmit}>
                Create Volume
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
  remoteClouds: state.remoteClouds
});

export default connect(stateToProps)(VolumeForm);
