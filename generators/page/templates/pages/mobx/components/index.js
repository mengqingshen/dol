/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file root react component for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class IndexContainers extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div>Hello world!</div>
    )
  }
}
