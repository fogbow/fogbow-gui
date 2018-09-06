import React, { Component } from 'react';

import OrderList from '../components/OrderList';
import FloatingIpForm from '../components/FloatingIpForm';

class FloatingIpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableVisible: true,
            orderId: ''
        }
    }

    componentDidMount = () => {
        const { dispatch } = this.props;
        // dispatch(getAttachments());
    };

    get floatingIps() {
        return this.props.attachments.loading ? this.props.attachments.data: [];
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
                <OrderList orders={[]} form={<FloatingIpForm/>}  
                    type={'floatip'} handleShow={this.handleShow}/>
                
            </div>
        );
    }
}

export default FloatingIpPage;