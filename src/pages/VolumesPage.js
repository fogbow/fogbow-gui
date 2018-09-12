import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        this.state.intervalId = setInterval(async() => {
            await dispatch(getVolumes());
        }, 5000);
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
    }

    render() {
        return (
            <div>
                {this.state.tableVisible ?
                    (<OrderList orders={this.volumes} form={<VolumeForm/>} 
                    type={'volumes'} handleShow={this.handleShow}/>):
                    <VolumeDetails id={this.state.orderId}/>
                }
            </div>
        );
    }
}

const stateToProps = state => ({
    volumes: state.volumes
});

export default connect(stateToProps)(VolumesPage);
