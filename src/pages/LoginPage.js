import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import { parse } from 'query-string';
import _ from 'lodash';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';

import { getAuthorization, getFnsPublicKey } from '../actions/auth.actions';
import { env } from '../defaults/api.config';

let fields = Object.keys(env.credentialFields).map(key => {
  return { [key]: '' }
});

const initialState = Object.assign({}, ...fields)

class LoginPage extends Component {
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

  resetState = () => this.setState(initialState);

  login = async(event) => {
    event.preventDefault();

    let { history, dispatch } = this.props;

    if (env.remoteCredentialsUrl) {
      window.location.href = env.remoteCredentialsUrl;
    } else if (!_.isEmpty(env.credentialFields)) {
      try {
        const tokenData = await dispatch(getAuthorization(this.state));
        localStorage.setItem('token', tokenData.token);

        history.push('/fogbow');
      } catch (err) {
        console.log(err);
        this.resetState();
        history.push('/');
      }
    }
  }

  remoteCredentialsLogin = async(remoteCredentials) => {
    let { history, dispatch } = this.props;

    try {
      const data = await dispatch(getAuthorization(remoteCredentials));
      localStorage.setItem('token', data.token);
      history.push('/fogbow');
    } catch (err) {
      console.log(err);
      this.resetState();
    }
  }

  generateCredentialsFields = () => {
    // NOTE(pauloewerton): remote authentication has precedence in case both are
    // defined on the config file.
    if (!_.isEmpty(env.credentialFields)) return this.generateInputs();
  };

  generateDropdown = (field, label, options) => {
    return (
      <div>
        <label>{label}</label>
        <select value={this.state[field]} onChange={this.handleChange} name={field}
                className="form-control">
          <option value=''>Choose an option</option>
          { options.map(option => <option value={option}>{option}</option>) }
        </select>
      </div>
    );
  };

  generateInputs = () => {
    let fields = env.credentialFields;

    return(
      <div>
        {Object.keys(fields).map(field => {
          let {label, type} = fields[field];
          if (type === 'dropdown') {
            let { options } = fields[field];
            return this.generateDropdown(field, label, options);
          }

          return (
            <div className="form-group" key={field}>
              <label>{label}</label>

              <input value={this.state[field]} onChange={this.handleChange} name={field}
              type={type} className="form-control"/>
            </div>
          );
        })}
      </div>
    );
  };

  componentDidMount = async() => {
    let { dispatch } = this.props;
    const publicKeyData = await dispatch(getFnsPublicKey());
    localStorage.setItem('publicKey', publicKeyData.token);

    const remoteCredentialsRedirectUrl = this.props.location.search;

    if (remoteCredentialsRedirectUrl) {
      let remoteCredentials = parse(remoteCredentialsRedirectUrl);
      this.remoteCredentialsLogin(remoteCredentials);
    }
  }

  render() {
    return (
      <div>
        <form className="login-form">
          <img className="image" src={require("../assets/logo_fogbow_transparent.png")}
          alt="Fogbow"></img>
          <h3>Login</h3>

          <hr className="horizontal-line"/>

          <p>Authentication Service : {env.authenticationPlugin}</p>

          {env.remoteCredentialsUrl ? undefined : this.generateCredentialsFields()}
        </form>
        <div className="form-footer">
          <button type="submit" onClick={this.login} className="btn btn-primary submit">
            Sign in
          </button>
        </div>
        <ToastContainer transition={Slide} autoClose={false} />
      </div>
    );
  }
}

export default connect()(LoginPage);
