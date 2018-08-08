import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return (
      <div>
          <BrowserRouter>
            <main>
              <Switch>
              </Switch>
          </main>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect()(App);
