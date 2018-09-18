import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

class App extends Component {
  isAuthenticated = (transition) => {
    const hasToken = !!localStorage.getItem('token');
    if(!hasToken)
      transition.redirect('/');
  };

  render() {
    return (
      <div>
          <BrowserRouter>
            <main>
              <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/fogbow" component={DashboardPage} onEnter={this.isAuthenticated}/>
              </Switch>
            </main>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect()(App);
