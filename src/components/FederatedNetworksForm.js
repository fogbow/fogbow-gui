import React, { Component } from 'react';
import { connect } from 'react-redux';

const initialState = {
    cidrNotation: '188.140.0.0/24',
    label: '',
    allowedMembers: []
};

class FederatedNetworksForm extends Component {
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

    handleAddMember = (event) => {
        let value = event.target.value;
        let members = this.state.allowedMembers;
        if(!members.includes(value)) {
            // TODO
        } else {

        }
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
                            <label>Label</label>
                            <input className="form-control" type="text" name="label" value={this.state.label} onChange={this.handleChange}/>
                            
                            <label>CIDR</label>
                            <input className="form-control" type="text" name="cidrNotation" value={this.state.cidrNotation} onChange={this.handleChange}/>

                            <label>Members</label>
                            { this.props.members.data.map((member, idx) => { 
                                return(
                                    <div>
                                        <label>
                                            <input type="checkbox" key={idx} value={member} onChange={this.handleAddMember}/>
                                            { member }
                                        </label>
                                    </div>
                                )
                            }) 
                            }

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Create federated network</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    members: state.members,
});

export default connect(stateToProps)(FederatedNetworksForm);