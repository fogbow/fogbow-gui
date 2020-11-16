import React, { Component } from "react";
import { connect } from "react-redux";

class OrderActions extends Component {
  render() {
    return (
      <div className='btn-group' role='group'>
        <button className='btn btn-secondary dropdown-toggle'
          data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'
          id='btnGroupDrop1'>
        </button>
        <div className='dropdown-menu order-dropdown' aria-labelledby='btnGroupDrop1'>
          { this.props.actions.map(action => (
            <button 
              className='dropdown-item' 
              onClick={action.onClick}
              name={action.name}
              value={action.value} data-toggle='modal'
              data-target={action.modalId}>
            {action.text}
            </button>
          ))}
        </div>
      </div>
    )
  }
}

export default connect()(OrderActions);