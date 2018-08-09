import React, { Component } from 'react';

import '../styles/sidebar.css';

class SidebarComponent extends Component {
    render() {
        return (
            <div className="sidebar">
                <img className="image" src={require("../assets/logo_fogbow_transparent.png")} alt="Fogbow"></img>

                <p className="federation-label">Federation</p>
                <hr className="horizontal-line"/>

                <div className="links">
                    <p>User Panel</p>
                    <ul Style="list-style-type: none">
                        <li><a>Members</a></li>
                        <li><a>Orders</a></li>
                        <li><a>Instances</a></li>
                        <li><a>Volumes</a></li>
                        <li><a>Networks</a></li>
                        <li><a>Attachments</a></li>
                        <li><a>Usage</a></li>
                        <li><a>Overview</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default SidebarComponent;
