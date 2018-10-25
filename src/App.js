import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

class App extends Component {
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
