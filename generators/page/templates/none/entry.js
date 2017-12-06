/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file entry for page named <$= pageName $>. <$= pageCreateDate $>
 */

import React from 'react'
import { render } from 'react-dom'
import Index from './components'

import './style.scss'

render(
  <div className="<$= pageRootClassName $>">
    <Index />
  </div>,
  document.getElementById('page-content')
)
