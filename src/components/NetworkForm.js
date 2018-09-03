import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { createNetwork } from '../actions/networks.actions';

const initialState = {
    address: '',
    gateway: '',
    allocation: '',
    member: ''
}

class NetworkForm extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    handleChange = (event) => {
        let { name, value } = event.target;
        
        this.setState({
            [name]: value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        let body = _.pickBy(this.state, _.identity);
        
        let { dispatch } = this.props;
        dispatch(createNetwork(body));
    };

    render() {
        return (
            <div className="modal fade" id="form" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Create Network</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <label>CIDR</label>
                        <input className="form-control" type="text" name="address" onChange={this.handleChange}/>

                        <label>Gateway</label>
                        <input className="form-control" type="text" name="gateway" onChange={this.handleChange}/>

                        <label>Allocation</label>
                        <select  name='allocation' className="form-control" onChange={this.handleChange}>
                            <option value='dynamic'>dynamic</option>
                            <option value='static'>static</option>
                        </select>

                        <label>Member</label>
                        <select name='member' className="form-control" onChange={this.handleChange}>
                            <option value=''></option>
                            { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                        </select>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create Compute</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    members: state.members
});

export default connect(stateToProps)(NetworkForm);