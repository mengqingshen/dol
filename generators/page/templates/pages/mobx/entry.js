/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file entry for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
import IndexContainer from './containers'
import RootStore from './stores'

import './style.scss'


const rootStore = new RootStore()

render(
  <div className="<$= pageRootClassName $>">
    <DevTools />
    <Provider {...rootStore} >
      <IndexContainer />
    </Provider>
  </div>,
  document.getElementById('page-content')
)
