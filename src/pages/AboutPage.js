import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVersion } from '../actions/version.actions';

class AboutPage extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;

    if (! this.props.version.loading) {
      dispatch(getVersion());
    }
  };

  render() {
    return (
      <div>
        <dl className='about'>
          {
            this.props.version.loading ?
              Object.keys(this.props.version.data)
                .map((version, idx) => {
                  return (
                    <div key={idx} className='row'>
                      <dt className='col-sm-3'>{version}</dt>
                      <dd className='col-sm-9'>{'v.' + this.props.version.data[version]}</dd>
                    </div>
              );}) :
            undefined
          }
        </dl>
      </div>
    );
  }
}

const stateToProps = state => ({
  version: state.version
});

export default connect(stateToProps)(AboutPage);
