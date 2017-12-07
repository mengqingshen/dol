/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file store creator. <$= pageCreateDate $>
 */

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'

const middlewares = [
  thunk,
  promiseMiddleware
]

if (process.env.NODE_ENV === 'development') {
  // 调用日志打印方法 collapsed是让action折叠，看着舒服点
  const loggerMiddleware = require('redux-logger').createLogger({ collapsed: true })
  middlewares.push(loggerMiddleware)
}

export default (reducers, initialState) => {
  let enhancer = applyMiddleware(...middlewares)
  if (process.env.NODE_ENV === 'development') {
    enhancer = require('redux-devtools-extension').composeWithDevTools(enhancer)
  }
  const store = createStore(reducers(), initialState, enhancer)
  return store
}
