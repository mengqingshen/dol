/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file the root container of the page. <$= pageCreateDate $>
 */

import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import pureRender from 'pure-render-immutable-decorator'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Index from '../components'
import actions from '../actions'


@pureRender
class Container extends React.Component {
  static propTypes = {
    request: ImmutablePropTypes.recordOf({
      globalLoading: PropTypes.bool
    }),
  }
  render() {
    return (
      <Index {...this.props} />
    )
  }
}

const mapStateToProps = state => state.toObject()

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
