import React, { Component } from 'react';

import SidebarComponent from '../components/SidebarComponent';

import QuotaPage from './QuotaPage';
import ComputesPage from './ComputesPage';

class DashboardComponent extends Component {

    goto = (tab) => {
        switch (tab) {
            case 'quota':
                return <QuotaPage/>;
            
            case 'computes':
                return <ComputesPage/>
        
            default:
                break;
        }        
    };

    render() {
        return (
            <div>
                <SidebarComponent goto={this.goto} defaultView={<QuotaPage/>}/>
            </div>
        );
    }
}

export default DashboardComponent;