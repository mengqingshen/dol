/**
 * @author <$= moduleAuthorName $>, <$= moduleAuthorEmail $>
 * @file a store module named <$= moduleName $>. <$= moduleCreateDate $>
 */

import React from 'react'
import Type from 'prop-types'
import { observer, inject, PropTypes } from 'mobx-react'

@inject('mainStore')
@observer
export default class extends React.Component {
  static propTypes = {}

  render() {
    return <div></div>
  }
}
