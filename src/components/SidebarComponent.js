import React, { Component } from 'react';
import _ from 'lodash';

import '../styles/sidebar.css';

import { resources as tabs } from '../defaults/resources.types';
import { env } from '../defaults/api.config';

class SidebarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: tabs,
      content: props.defaultView
    };
  }

  setContent = (tab) => {
    this.setState({
        content: this.props.goto(tab)
    });
  };

  renderItens = () => {
    let currentTabs;
    if(env.deployType !== "federation-site") {
      currentTabs = _.remove(tabs, tab => tab.value === "fednets")
    } else {
      currentTabs = tabs;
    }

    return tabs.map(tab => {
      return(
        <li key={tab.text} onClick={() => this.setContent(tab.value)} style={{cursor: 'Pointer'}}>
          {tab.text}
        </li>
      )
    });
  };

  render() {
    return (
      <div className="row">
        <div className="sidebar col col-lg-2">
          <img className="d-block mx-auto" src={require("../assets/logo_fogbow_transparent.png")}
               alt="Fogbow"></img>

          <p className="federation-label">User Panel</p>
          <hr className="horizontal-line"/>

          <div className="links">
            <ul className='list-unstyled'>
                {this.renderItens()}
            </ul>
          </div>
        </div>
        <div className="col content">
          {this.state.content}
        </div>
      </div>
    );
  }
}

export default SidebarComponent;
