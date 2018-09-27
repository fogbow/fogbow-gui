import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import { getVolumes } from '../actions/volumes.actions';
import VolumeForm from '../components/VolumeForm';
import VolumeDetails from '../components/VolumeDetails';


class VolumesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableVisible: true,
            orderId: '',
            intervalId: ''
        }
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getVolumes());
        this.setState({
            intervalId: setInterval(async() => {
                await dispatch(getVolumes());
            }, env.refreshTime)
        });
    };

    componentWillUnmount = () => {
        clearInterval(this.state.intervalId);
    }

    get volumes() {
        return this.props.volumes.loading ? this.props.volumes.data: [];
    }

    handleShow = (orderId) => {
        this.setState({
            tableVisible: false,
            orderId
        });
    };

    handleHide = () => {
        this.setState({
            tableVisible: true
        });
    };

    render() {
        return (
            <div>
                {this.state.tableVisible ?
                    (<OrderList orders={this.volumes} form={<VolumeForm/>} 
                    type={'volumes'} handleShow={this.handleShow}/>):
                    <VolumeDetails id={this.state.orderId} handleHide={this.handleHide}/>
                }
            </div>
        );
    }
}

const stateToProps = state => ({
    volumes: state.volumes
});

export default connect(stateToProps)(VolumesPage);
