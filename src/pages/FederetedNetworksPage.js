import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import { getFedNetworks } from '../actions/networks.actions';
import FederatedNetworksForm from '../components/FederatedNetworksForm';
import FedNetDetails from '../components/FedNetDetails';

class FederetedNetworksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableVisible: true,
            orderId: ''
        }
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getFedNetworks())
    };

    get networks() {
        return this.props.networks.loading ? this.props.networks.data: [];
    }

    handleShow = (orderId) => {
        this.setState({
            tableVisible: false,
            orderId
        });
    }

    render() {
        return (
            <div>
                {this.state.tableVisible ? 
                (<OrderList orders={this.networks} disableProvider={true} handleShow={this.handleShow}
                 type={'fednets'} form={<FederatedNetworksForm/>}/>):
                 <FedNetDetails id={this.state.orderId}/>
                }
            </div>
        );
    }
}

const stateToProps = state => ({
    networks: state.fedNetworks
});

export default connect(stateToProps)(FederetedNetworksPage);