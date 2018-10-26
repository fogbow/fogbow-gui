import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVersion } from '../actions/version.actions';

class AboutPage extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(getVersion());
  };

  render() {
    return (
      <div>
        {this.props.version.loading ? <p>{alert(JSON.stringify(this.props.version.data))}</p> : <p>frangote</p>}
      </div>
    );
  }
}

const stateToProps = state => ({
  version: state.version
});

export default connect(stateToProps)(AboutPage);
