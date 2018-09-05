import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import { getNetworks } from '../actions/networks.actions';
import NetworkForm from '../components/NetworkForm';
import NetworkDetails from '../components/NetworkDetails';

class NetworksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableVisible: true,
            orderId: ''
        }
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getNetworks())
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
                (<OrderList orders={this.networks} form={<NetworkForm/>} 
                    type={'networks'} handleShow={this.handleShow}/>):
                <NetworkDetails id={this.state.orderId}/>}
            </div>
        );
    }
}

const stateToProps = state => ({
    networks: state.networks
});

export default connect(stateToProps)(NetworksPage);