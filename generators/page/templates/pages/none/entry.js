/**
 * @file entry for page named <$= pageName $>. <$= pageCreateDate $>
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
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
