import React, { Component } from 'react';

class AttachmentForm extends Component {
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
                        <select name='member' className="form-control">
                            <option value=''></option>
                            {/* { this.props.members.data.map((member, idx) => <option key={idx} value={member}>{member}</option>) } */}
                        </select>

                        <label>Compute</label>
                        <select  name='member' className="form-control">
                            <option value=''></option>
                            {/* {
                                this.props.images.loading ?
                                this.props.images.data.map((image, idx) => <option key={idx} value={image}>{image}</option>):
                                undefined
                            } */}
                        </select>

                        <label>Volume</label>
                        <select name='member' className="form-control">
                            <option value=''></option>
                            {/* { 
                                this.props.networks.loading ?
                                this.props.networks.data.map((network, idx) => <option key={idx} value={network}>{network}</option>):
                                undefined
                            } */}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Create Attachment</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AttachmentForm;