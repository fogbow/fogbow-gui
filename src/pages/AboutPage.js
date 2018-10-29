import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVersion } from '../actions/version.actions';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {versions: undefined};
  }

  componentDidMount = () => {
    const { dispatch } = this.props;

    if (! this.props.version.loading) {
      dispatch(getVersion());
    }
  };

  render() {
    return (
      <div>
        {
          this.props.version.loading ?
          Object.keys(this.props.version.data)
              .map((version, idx) =>
                <p key={idx}>{version + ': v.' + this.props.version.data[version]}</p>) :
          undefined
        }
      </div>
    );
  }
}

const stateToProps = state => ({
  version: state.version
});

export default connect(stateToProps)(AboutPage);
