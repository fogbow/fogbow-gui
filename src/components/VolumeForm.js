import React, { Component } from 'react';

class VolumeForm extends Component {
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
                        <label>Volume size (in GB)</label>
                        <input className="form-control" type="number"/>

                        <label>Name</label>
                        <input className="form-control" type="text"/>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Create Volume</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VolumeForm;