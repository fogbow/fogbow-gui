import React, { Component } from 'react';

import '../styles/sidebar.css';

import { resources as tabs } from '../defaults/resources.types';

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
          <img className="image" src={require("../assets/logo_fogbow_transparent.png")} alt="Fogbow"></img>

          <p className="federation-label">Federation</p>
          <hr className="horizontal-line"/>

          <div className="links">
            <p>User Panel</p>
            <ul style={{listStyleType: 'none'}}>
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
