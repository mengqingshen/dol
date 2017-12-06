/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file entry for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createStore from './create-store'
import Container from './containers'
import reducers from './reducers'
import './style'


const store = createStore(reducers)

ReactDOM.render((
  <div className="<$= pageRootClassName $>">
    <Provider store={store}>
      <Container />
    </Provider>
  </div>
), document.getElementById('page-content'))
