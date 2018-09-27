import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/login.css';

import { getAuthorization } from '../actions/auth.actions';
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

    login = (event) => {
        event.preventDefault();

        if (env.cafeEndpoint) {
            this.loginWithCafe(event);
        } else {
            let { history, dispatch } = this.props;
            dispatch(getAuthorization(this.state))
                .then(data => {
                    localStorage.setItem('token', data.token);
                    history.push('/fogbow');
                }, err => {
                    console.log(err);
                    this.resetState();
                });
        }

    };

    loginWithCafe = (event) => {
        event.preventDefault();
        // TODO: post to cafe auth url.
    };

    generateDropdown = (field, label, options) => {
        return (
            <div>
                <label>{label}</label>
                <select value={this.state[field]} onChange={this.handleChange} name={field} className="form-control">
                    <option value=''>Choose an option</option>
                    {
                        options.map(option => <option value={option}>{option}</option>)
                    }
                </select>
            </div>
        );
    };

    generateAuth = () => {
        if(!env.cafeEndpoint)
            return this.generateInputs();
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
                    <button type="submit" onClick={this.login} className="btn btn-primary submit">Sign in</button>
                </div>
            </div>
        );
    }
}

export default connect()(LoginPage);