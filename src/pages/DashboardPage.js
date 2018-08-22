import React, { Component } from 'react';

import TopMenu from '../components/TopMenu';
import SidebarComponent from '../components/SidebarComponent';

import QuotaPage from './QuotaPage';
import ComputesPage from './ComputesPage';
import VolumesPage from './VolumesPage';
import NetworksPage from './NetworksPage';
import AttachmentsPage from './AttachmentsPage';

class DashboardComponent extends Component {

    goto = (tab) => {
        switch (tab) {
            case 'quota':
                return this.getPageContent(<QuotaPage/>);
            
            case 'computes':
                return this.getPageContent(<ComputesPage/>);
            
            case 'volumes':
                return this.getPageContent(<VolumesPage/>);

            case 'networks':
                return this.getPageContent(<NetworksPage/>);
            
            case 'attachments':
                return this.getPageContent(<AttachmentsPage/>);
        
            default:
                break;
        }        
    };

    getPageContent = (tab) => {
        return(
            <div>
                <TopMenu /> 
                { tab }
            </div>
        );
    }

    render() {
        return (
            <div>
                <SidebarComponent goto={this.goto} defaultView={this.getPageContent(<QuotaPage/>)}/>
            </div>
        );
    }
}

export default DashboardComponent;