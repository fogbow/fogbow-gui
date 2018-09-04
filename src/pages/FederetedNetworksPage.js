import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import { getFedNetworks } from '../actions/networks.actions';
import FederatedNetworksForm from '../components/FederatedNetworksForm';

class FederetedNetworksPage extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getFedNetworks())
    };

    get networks() {
        return this.props.networks.loading ? this.props.networks.data: [];
    } 

    render() {
        return (
            <OrderList orders={this.networks} disableProvider={true} form={<FederatedNetworksForm/>}/>
        );
    }
}

const stateToProps = state => ({
    networks: state.fedNetworks
});

export default connect(stateToProps)(FederetedNetworksPage);