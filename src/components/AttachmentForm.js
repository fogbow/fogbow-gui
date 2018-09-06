import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getComputes } from '../actions/computes.actions';
import { getVolumes } from '../actions/volumes.actions';
import { createAttachment } from '../actions/attachments.actions';

const initialState = {
    member: '',
    source: '',
    target: '',
    device: '/dev/sdd'
};

class AttachmentForm extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount = () => {
        let { dispatch } = this.props;
        if(! this.props.computes.loading) {
            dispatch(getComputes());
        }
        if(! this.props.volumes.loading) {
            dispatch(getVolumes());
        }
    };
    
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
        dispatch(createAttachment(body));
    };

    render() {
        return (
            <div className="modal fade" id="form" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create Attachment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <label>Member</label>
                            <select name='member' className="form-control" value={this.state.member} onChange={this.handleChange}>
                                <option value=''></option>
                                { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) }
                            </select>

                            <label>Compute</label>
                            <select  name='source' className="form-control" value={this.state.source} onChange={this.handleChange}>
                                <option value=''></option>
                                {
                                    this.props.computes.loading ?
                                    this.props.computes.data
                                        .filter(volume => volume.state === 'READY')
                                        .map((compute, idx) => <option key={idx} value={compute.instanceId}>{compute.instanceId}</option>):
                                    undefined
                                }
                            </select>

                            <label>Volume</label>
                            <select name='target' className="form-control" value={this.state.target} onChange={this.handleChange}>
                                <option value=''></option>
                                { 
                                    this.props.volumes.loading ?
                                    this.props.volumes.data
                                        .filter(volume => volume.state === 'READY')
                                        .map((volume, idx) => <option key={idx} value={volume.instanceId}>{volume.instanceId}</option>):
                                    undefined
                                }
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" 
                                onClick={this.handleSubmit}>Create Attachment</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    members: state.members,
    computes: state.computes,
    volumes: state.volumes
});

export default connect(stateToProps)(AttachmentForm);