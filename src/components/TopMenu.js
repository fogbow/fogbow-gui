import React, { Component } from 'react';

import '../styles/top-menu.css';

import { resources } from '../defaults/resources.types';

class TopMenu extends Component {
    
    get label() {
        return resources.find(tab => tab.value === this.props.labelName).text;
    }

    render() {
        return (
            <div className="top-menu">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse">
                        <h1 style={{fontSize: '30px', color: 'white'}}>{this.label}</h1>
                        <div className="my-4  ml-auto">
                            <a className="btn my-2 my-sm-0">Settings</a>
                            <a className="btn my-2 my-sm-0" onClick={this.props.logout}>Sign Out</a>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default TopMenu;