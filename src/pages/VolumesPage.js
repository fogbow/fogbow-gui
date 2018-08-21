import React, { Component } from 'react';
import { connect } from 'react-redux';

import OrderList from '../components/OrderList';
import { getVolumes } from '../actions/volumes.actions';


class VolumesPage extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch(getVolumes())
    };

    get volumes() {
        return this.props.volumes.loading ? this.props.volumes.data: [];
    } 

    render() {
        return (
            <OrderList orders={this.volumes}/>
        );
    }
}

const stateToProps = state => ({
    volumes: state.volumes
});

export default connect(stateToProps)(VolumesPage);
