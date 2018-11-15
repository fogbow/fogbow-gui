import React, { Component } from 'react';
import { connect } from 'react-redux';

import { env } from '../defaults/api.config';
import OrderList from '../components/OrderList';
import PublicIpForm from '../components/PublicIpForm';
import SecurityRuleForm from '../components/SecurityRuleForm';
import { getPublicIps } from '../actions/publicIps.actions';
import PublicIpDetails from '../components/PublicIpDetails';

class PublicIpPage extends Component {
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
    dispatch(getPublicIps());
    this.setState({
      intervalId: setInterval(async() => {
        if (this.state.tableVisible)
            await dispatch(getPublicIps());
      }, env.refreshTime)
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.state.intervalId);
  }

  get publicIps() {
    return this.props.publicIps.loading ? this.props.publicIps.data: [];
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

  handleSecurityRuleForm = (event) => {
    event.preventDefault();

    const instanceId = event.target.value;

    this.setState({instanceId: instanceId});
  };

  render() {
    return (
      <div>
        {this.state.tableVisible ?
         (<OrderList orders={this.publicIps} type={'publicip'} disabledHeaders={['Name']}
                     forms={[<PublicIpForm/>,
                             <SecurityRuleForm orderType='publicip'
                                               instanceId={this.state.instanceId}/>
                            ]}
                     handleSecurityRuleForm={this.handleSecurityRuleForm}
                     handleShow={this.handleShow} handleHide={this.handleHide}/>) :
         <PublicIpDetails id={this.state.orderId} handleHide={this.handleHide}/>}
      </div>
    );
  }
}

const stateToProps = state => ({
  publicIps: state.publicIps
});

export default connect(stateToProps)(PublicIpPage);
