import React, { Component } from 'react';

import '../styles/top-menu.css';

class TopMenu extends Component {
    render() {
        return (
            <div className="top-menu">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse">
                        <div className="my-4  ml-auto">
                            <a className="btn my-2 my-sm-0">Settings</a>
                            <a className="btn my-2 my-sm-0">Sign Out</a>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default TopMenu;