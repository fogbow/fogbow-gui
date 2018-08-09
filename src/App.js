import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPage from './pages/LoginPage';

class App extends Component {
  render() {
    return (
      <div>
          <BrowserRouter>
            <main>
              <Switch>
                <Route exact path="/" component={LoginPage} />
              </Switch>
          </main>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect()(App);
