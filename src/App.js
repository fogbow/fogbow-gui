import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { env } from './defaults/api.config';

class App extends Component {
  componentWillMount() {
    this.setEnv();
  }

  setEnv() {
    let serverEndpoint;

    switch(env.deployType) {
      case "federation-site":
        serverEndpoint = env.fns;
        break;
      default:
        serverEndpoint = env.ras;
    }

    Object.assign(env, {serverEndpoint: serverEndpoint});
  }

  render() {
    return (
      <div className='container-fluid'>
        <BrowserRouter>
          <main>
            <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/fogbow" component={DashboardPage}/>
            </Switch>
          </main>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect()(App);
