import React, { Component } from 'react';

import SidebarComponent from '../components/SidebarComponent';

import QuotaPage from './QuotaPage';

class DashboardComponent extends Component {

    goto = (tab) => {
        switch (tab) {
            case 'quota':
                return <QuotaPage/>;
        
            default:
                break;
        }        
    };

    render() {
        return (
            <div>
                <SidebarComponent goto={this.goto}/>
            </div>
        );
    }
}

export default DashboardComponent;