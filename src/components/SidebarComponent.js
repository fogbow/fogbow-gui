import React, { Component } from 'react';
import PropTypes from "prop-types";

import '../styles/sidebar.css';

const tabs = [
    { text: 'Quota', link: '/quota'    , selected: true},
    { text: 'Computes', link: 'members'     , selected: false},
    { text: 'Volumes', link: 'members'    , selected: false},
    { text: 'Networks', link: 'members'   , selected: false},
    { text: 'Federated Networks', link: 'members'  , selected: false},
    { text: 'Attachments', link: 'members', selected: false},
];

class SidebarComponent extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context);
        this.state = { tabs };
    }


    goto = (link) => {
        this.context.router.history.push(link);
    };

    renderItens = () => {
        return tabs.map(tab => {
            return(
                <li key={tab.text} onClick={() => this.goto(tab.link)}>
                    {tab.text}
                </li>
            ) 
        });
    };


    render() {
        return (
            <div className="sidebar">
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
        );
    }
}

export default SidebarComponent;