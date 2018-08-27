import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/order-form.css';

class ComputeForm extends Component {
    render() {
        return (
            <div className="modal fade" id="form" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Create Compute</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <label>Minimal number of vCPUs</label>
                        <input className="form-control" type="text"/>

                        <label>Minimal amount of RAM in MB</label>
                        <input className="form-control" type="text"/>

                        <label>Member</label>
                        <select value={this.props.members} name='member' className="form-control">
                            <option value=''></option>
                            { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                        </select>

                        <label>Image</label>
                        <select value={this.props.members} name='member' className="form-control">
                            <option value=''></option>
                            { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                        </select>

                        <label>Network id</label>
                        <select value={this.props.members} name='member' className="form-control">
                            <option value=''></option>
                            { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                        </select>

                        <label>Federated network id</label>
                        <select value={this.props.members} name='member' className="form-control">
                            <option value=''></option>
                            { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                        </select>

                        <label>Extra user file</label>
                        <input type="file" className="form-control"/>

                        <label>Extra user data file type</label>
                        <select value={this.props.members} name='member' className="form-control">
                            <option value=''></option>
                            { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                        </select>

                        <label>Public key</label>
                        <textarea className="form-control" type=""></textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Create Compute</button>
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

export default connect(stateToProps)(ComputeForm);