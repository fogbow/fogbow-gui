import React, { Component } from 'react';
import { parse } from 'query-string';

import TopMenu from '../components/TopMenu';
import SidebarComponent from '../components/SidebarComponent';

import QuotaPage from './QuotaPage';
import ComputesPage from './ComputesPage';
import VolumesPage from './VolumesPage';
import NetworksPage from './NetworksPage';
import AttachmentsPage from './AttachmentsPage';
import FederetedNetworksPage from './FederetedNetworksPage';
import FloatingIpPage from './FloatingIpPage';

class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.getTokenFromQueryString();
    }
    
    getTokenFromQueryString = () => {
        if (this.props.location.search) {
            const token = parse(this.props.location.search).token;
        
            if (token)
                localStorage.setItem('token', token);
        }
    };
    

    goto = (tab) => {
        switch (tab) {
            case 'quota':
                return this.getPageContent(<QuotaPage/>, tab);
            
            case 'computes':
                return this.getPageContent(<ComputesPage/>, tab);
            
            case 'volumes':
                return this.getPageContent(<VolumesPage/>, tab);

            case 'networks':
                return this.getPageContent(<NetworksPage/>, tab);
            
            case 'attachments':
                return this.getPageContent(<AttachmentsPage/>, tab);
            
            case 'fednets':
                return this.getPageContent(<FederetedNetworksPage/>, tab);
            
            case 'floatip':
                return this.getPageContent(<FloatingIpPage/>, tab);
        
            default:
                break;
        }        
    };

    getPageContent = (tab, label) => {
        return(
            <div>
                <TopMenu labelName={label} logout={this.logout}/> 
                { tab }
            </div>
        );
    }

    logout = (event) => {
        event.preventDefault();
        let { history } = this.props;
        localStorage.removeItem('token');
        history.push('/');
    };

    render() {
        return (
            <div>
                <SidebarComponent goto={this.goto} defaultView={this.getPageContent(<QuotaPage/>, 'quota')}/>
            </div>
        );
    }
}

export default DashboardComponent;