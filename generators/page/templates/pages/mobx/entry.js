/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file entry for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import IndexContainer from './containers'
import RootStore from './stores'

import './style.scss'


const rootStore = new RootStore()

const DevTools = () => {
  if (['debug'].includes(process.env.NODE_ENV)) {
    const MobxDevTools = require('mobx-react-devtools').default
    return <MobxDevTools />
  }
  return null
}

render(
  <div className="<$= pageRootClassName $>">
    <DevTools />
    <Provider {...rootStore} >
      <IndexContainer />
    </Provider>
  </div>,
  document.getElementById('page-content')
)
