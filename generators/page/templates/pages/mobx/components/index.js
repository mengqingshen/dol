/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file root react component for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import ReactPropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject('uiStore')
@observer
export default class Index extends React.Component {
  static propTypes = {
    uiStore: ReactPropTypes.shape({
      isLoading: ReactPropTypes.bool,
      doLoading: ReactPropTypes.func,
      doUnloading: ReactPropTypes.func,
    })
  }

  render() {
    return (
      <div>Hello world!</div>
    )
  }
}
