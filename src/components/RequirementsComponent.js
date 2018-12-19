import React, { Component } from 'react';
import { connect } from 'react-redux';

class RequirementsComponent extends Component {
  getRequirementsList = () => {
    return Object.keys(this.props.requirements).map((tag, idx) =>
             <li key={tag + idx}>{tag + ' : ' + this.props.requirements[tag]}</li>);
  };

  handleChange = (event) => {
    let {name, value} = event.target;

    if (name === 'tag') this.props.onRequirementTagChange(value);
    if (name === 'value') this.props.onRequirementValueChange(value);
  };

  render() {
    const requirementsList = this.getRequirementsList();
    const requirementTag = this.props.requirementTag;
    const requirementValue = this.props.requirementValue;

    return (
      <div>
        <div className="row">
          <div className="form-group col">
            <label>Requirements</label>
          </div>
        </div>
        <div>
          <div className="row">
            <div className="form-group col-md-4">
              <label>Tag</label>
              <input type="text" className="form-control" name="tag" value={requirementTag}
                     onChange={this.handleChange} size="13"/>
            </div>
            <div className="form-group col-md-4">
              <label>Value</label>
              <input type="text" className="form-control" name="value" value={requirementValue}
                     onChange={this.handleChange} size="13"/>
            </div>
            <div className="form-group col-md-4">
              <button className="btn btn-sm btn-success mr-md-1" onClick={this.props.onAddRequirement}>
                Add
              </button>
              <button className="btn btn-sm btn-danger" onClick={this.props.onResetRequirements}>
                Clear
              </button>
            </div>
          </div>
        </div>
        <ul className="requirements">
          {requirementsList}
        </ul>
      </div>
    );
  }
}

export default connect()(RequirementsComponent);
