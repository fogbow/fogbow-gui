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
                orderData: data.volume
            });
        })
    }

    render() {
        return (
            <div className="details">
                <button type="button" className="close" aria-label="Close" onClick={() => this.props.handleHide()}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2>Volume Details</h2>
                <hr className="horizontal-line"/>

                <p className="bolder">Name</p>
                <p>{this.state.orderData.name || '-'}</p>

                <p className="bolder">ID</p>
                <p>{this.state.orderData.id || '-'}</p>

                <p className="bolder">State</p>
                <p>{this.state.orderData.state || '-'}</p>

                <p className="bolder">Size</p>
                <p>{this.state.orderData.size || '-'} GB</p>
            </div>
        );
    }
}

export default connect()(VolumeDetails);
