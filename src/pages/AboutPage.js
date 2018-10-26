import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVersion } from '../actions/version.actions';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(getVersion());
  };

  render() {
    return (
      <div>
        {this.props.version.loading ?
          Object.keys(this.props.version.data).map((service, idx) => {
            return <div key={idx}>{service}</div>;
          }) : <div>something went wrong</div>
        }
      </div>
    );
  }
}

const stateToProps = state => ({
  version: state.version
});

export default connect(stateToProps)(AboutPage);
