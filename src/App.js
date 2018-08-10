import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPage from './pages/LoginPage';
import MembersPage from './pages/MembersPage';

class App extends Component {
  render() {
    return (
      <div>
          <BrowserRouter>
            <main>
              <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/fogbow/members" component={MembersPage} />
              </Switch>
            </main>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect()(App);
