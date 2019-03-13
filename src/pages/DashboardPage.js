import { ToastContainer, Slide } from 'react-toastify';
import { connect } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import React, { Component } from 'react';

import TopMenu from '../components/TopMenu';
import SidebarComponent from '../components/SidebarComponent';

import QuotaPage from './QuotaPage';
import ComputesPage from './ComputesPage';
import VolumesPage from './VolumesPage';
import NetworksPage from './NetworksPage';
import AttachmentsPage from './AttachmentsPage';
import FederetedNetworksPage from './FederetedNetworksPage';
import PublicIpPage from './PublicIpPage';
import AboutPage from './AboutPage';

import { getLocalClouds } from '../actions/clouds.actions';

class DashboardComponent extends Component {
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
      case 'publicip':
        return this.getPageContent(<PublicIpPage/>, tab);
      case 'about':
        return this.getPageContent(<AboutPage/>, tab);
      default:
        break;
    }
  };

  componentDidMount = async() => {
    let { history, dispatch } = this.props;
    const forbidden = 401;

    if (!localStorage.getItem('token')) {
      history.push('/');
    } else {
      try {
        await dispatch(getLocalClouds());
      } catch (error) {
        // NOTE(pauloewerton): this is a workaround to check whether the token has expired;
        // ideally, Fogbow would have a token validation function.
        if (error.error.response.status === forbidden) history.push('/');
      }
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
        <ToastContainer transition={Slide} autoClose={false} />
      </div>
    );
  }
}

export default connect()(DashboardComponent);
