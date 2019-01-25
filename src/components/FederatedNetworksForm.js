import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { createFedNetwork } from '../actions/networks.actions';

const initialState = {
  name: '',
  cidr: '188.140.0.0/24',
  providingMembers: []
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
    let members = this.state.providingMembers;

    if(!members.includes(value)) {
      this.setState({
          providingMembers: members.concat([value])
      });
    } else {
      this.setState({
          providingMembers: members.filter(member => member !== value)
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let body = _.pickBy(this.state, _.identity);

    let { dispatch } = this.props;
    dispatch(createFedNetwork(body));
    this.resetForm();
  };

  resetForm = () => {
    this.setState(initialState);
  };

  render() {
    return (
      <div className="modal fade" id="form" tabIndex="-1" role="dialog"
           aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Create Federated Network</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                      onClick={this.resetForm}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Name</label>
              <input value={this.state.name} onChange={this.handleChange} className="form-control"
                     type="text" name="name"/>

              <label>CIDR</label>
              <input className="form-control" type="text" name="cidr"
                     value={this.state.cidr} onChange={this.handleChange}/>

              <label>Members</label>
              {
                this.props.members.data.map((member, idx) => {
                  return(
                    <div key={idx}>
                      <label>
                        <input type="checkbox" value={member} onChange={this.handleAddMember}/>
                        { member }
                      </label>
                    </div>
                  );
                })
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal"
                      onClick={this.resetForm}>
                Close
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal"
                      onClick={this.handleSubmit}>
                Create Federated Network
              </button>
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
