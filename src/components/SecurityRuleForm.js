import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { createNetworkSecurityRule } from '../actions/networks.actions';
import { createPublicIpSecurityRule } from '../actions/publicIps.actions';

const initialState = {
  direction: 'ingress',
  portFrom: 0,
  portTo: 0,
  cidr: '0.0.0.0/0',
  etherType: 'IPv4',
  protocol: 'tcp',
  openPort: 'port'
};

const protocols = ['TCP', 'UDP', 'ICMP', 'Any'];

class SecurityRuleForm extends Component {
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

  handleSubmit = async(event) => {
    event.preventDefault();

    let body = _.pickBy(this.state, _.identity);
    let { dispatch, instanceId } = this.props;
    let createRuleFunc = this.props.orderType === 'network' ? createNetworkSecurityRule :
                                                              createPublicIpSecurityRule;

    if (!body.portTo) body.portTo = body.portFrom;
    delete body.openPort;

    try {
      await dispatch(createRuleFunc(body, instanceId));
      toast.success('Security rule successfully created.');
    } catch (error) {
      console.log(error);
    }

    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  render() {
    return (
      <div className='modal fade' id='security-rule-form' tabIndex='-1' role='dialog'
           aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
                <h5 className='modal-title' id='exampleModalLabel'>Create Security Rule</h5>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'
                        onClick={this.resetForm}>
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div className="modal-body needs-validation">
              <div className='form-row'>
                <div className='col'>
                  <label>Order ID</label>
                  <input className='form-control' type='text' name='instanceId'
                         placeholder={this.props.instanceId} size='50' readOnly />
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>Protocol</label>
                  <select name='protocol' className="form-control" required
                          value={this.state.protocol} onChange={this.handleChange}>
                    {
                      protocols.map((protocol, idx) => {
                        return <option key={idx} value={protocol.toLowerCase()}>{protocol}</option>;
                      })
                    }
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>Direction</label>
                  <select name='direction' className='form-control' required
                          value={this.state.direction} onChange={this.handleChange}>
                    <option value='ingress'>Ingress</option>
                    <option value='egress'>Egress</option>
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>Open Port</label>
                  <select name='openPort' className='form-control' required
                          value={this.state.openPort} onChange={this.handleChange}>
                    <option value='port'>Port</option>;
                    <option value='portRange'>Port Range</option>;
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>{this.state.openPort === 'port' ? 'Port' : 'From Port'}</label>
                  <input className="form-control" type="number" name="portFrom" min='0'
                         value={this.state.portFrom} onChange={this.handleChange} required />
                </div>
              </div>

              {this.state.openPort === 'portRange' ?
                <div className='form-row'>
                  <div className='col'>
                    <label>To Port</label>
                    <input className="form-control" type="number" name="portTo" min='0'
                           value={this.state.portTo} onChange={this.handleChange} required />
                  </div>
                </div> :
                undefined
              }

              <div className='form-row'>
                <div className='col'>
                  <label>Ether Type</label>
                  <select name='etherType' className='form-control' required
                          value={this.state.etherType} onChange={this.handleChange}>
                    <option value='IPv4'>IPv4</option>
                    <option value='IPv6'>IPv6</option>
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='col'>
                  <label>CIDR</label>
                  <input className="form-control" type="text" name="cidr" required
                         value={this.state.cidr} onChange={this.handleChange} />
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
                      onClick={this.resetForm}>
                Close
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal"
                      onClick={this.handleSubmit}>
                Create Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(SecurityRuleForm);
