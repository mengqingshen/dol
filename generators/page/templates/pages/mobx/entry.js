/**
 * @file entry for page named <$= pageName $>. <$= pageCreateDate $>
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 */

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import Index from './containers'
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
      <Index />
    </Provider>
  </div>,
  document.getElementById('page-content')
)
