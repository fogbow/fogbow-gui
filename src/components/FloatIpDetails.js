import React, { Component } from 'react';

import { getFloatIpData } from '../actions/floatIps.actions';

class FloatIpDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        }
    }

    componentDidMount() {
        let { dispatch } = this.props;
        dispatch(getFloatIpData(this.props.id)).then(data => {
            this.setState({
                orderData: data.floatIp
            });
        });
    }

    render() {
        return (
            <div className="details">
                {/* <button type="button" class="close" aria-label="Close" onClick={() => this.props.handleHide()}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2>Information</h2>
                <hr className="horizontal-line"/>

                <p className="bolder">Network id</p>
                <p>{this.state.orderData.id || '-'}</p>

                <p className="bolder">Name</p>
                <p>{this.state.orderData.name || '-'}</p>

                <p className="bolder">Address (CIDR)</p>
                <p>{this.state.orderData.address || '-'}</p>

                <p className="bolder">Gateway</p>
                <p>{this.state.orderData.gateway || '-'}</p>

                <p className="bolder">State</p>
                <p>{this.state.orderData.state || '-'}</p> */}
            </div>
        );
    }
}

export default FloatIpDetails;