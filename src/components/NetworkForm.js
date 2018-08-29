import React, { Component } from 'react';

class NetworkForm extends Component {
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
                        <input className="form-control" type="text"/>

                        <label>Gateway</label>
                        <input className="form-control" type="text"/>

                        <label>Allocation</label>
                        <select  name='member' className="form-control">
                            <option value=''></option>
                        </select>

                        <label>Member</label>
                        <select name='member' className="form-control">
                            <option value=''></option>
                            {/* { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) } */}
                        </select>

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

export default NetworkForm;