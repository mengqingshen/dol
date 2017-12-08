/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file root react component for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import { Index } from '../components'

@inject('uiStore')
@observer
export default class IndexContainer extends React.Component {
  render() {
    return (
      <Index {...this.props} />
    )
  }
}
