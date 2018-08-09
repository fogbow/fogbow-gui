import React, { Component } from 'react';

import '../styles/login.css';

const initialState = {
    username: '',
    password: ''
}

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

    login = (event) => {
        event.preventDefault();

        let { history } = this.props;

        history.push('/fogbow/members');
    };

    render() {
        return (
            <div>
                <form className="login-form">
                    <img className="image" src={require("../assets/logo_fogbow_transparent.png")}
                    alt="Fogbow"></img>
                    <h3>Login</h3>

                    <hr className="horizontal-line"/>

                    <p>Federation identity plugin :</p>

                    <div className="form-group">
                        <label>Username</label>

                        <input value={this.state.username} onChange={this.handleChange} name="text"
                        type="email" className="form-control" placeholder="Enter email"/>

                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input value={this.state.password} onChange={this.handleChange} name="password"
                        type="password" className="form-control" placeholder="Password"/>
                    </div>

                </form>
                <div className="form-footer">
                    <button type="submit" onClick={this.login} className="btn btn-primary submit">Sign in</button>
                </div>
            </div>
        );
    }
}

export default LoginPage;