import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVolumeData } from '../actions/volumes.actions';

class VolumeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        }
    }

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(getVolumeData(this.props.id)).then(data => {
            this.setState({
                orderData: data.volume[0]
            });
        })
    }

    render() {
        return (
            <div>
                <h2>Information</h2>

                <p>Volume id</p>
                <p>{this.state.orderData.id || '-'}</p>
                <p>Volume size (in GB)</p>
                <p>{this.state.orderData.name || '-'}</p>
                <p>Name</p>
                <p>{this.state.orderData.size || '-'}</p>
                <p>State</p>
                <p>{this.state.orderData.state || '-'}</p>
            </div>
        );
    }
}

export default connect()(VolumeDetails);