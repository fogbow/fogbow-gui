import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import { parse } from 'query-string';

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

    if (env.remoteEndpoint) {
      window.location.href = env.remoteEndpoint;
    } else {
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

  shibbolethLogin = async(shibbolethCredentials) => {
    let { history, dispatch } = this.props;

    try {
      const data = await dispatch(getAuthorization(shibbolethCredentials));
      localStorage.setItem('token', data.token);
      history.push('/fogbow');
    } catch (err) {
      console.log(err);
      this.resetState();
    }
  }

  generateAuth = () => {
    if (!env.remoteEndpoint)
      return this.generateInputs();
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

    const shibbolethRedirect = this.props.location.search;

    if (shibbolethRedirect) {
      let shibbolethCredentials = parse(shibbolethRedirect);
      this.shibbolethLogin(shibbolethCredentials);
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

          {this.generateAuth()}
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
