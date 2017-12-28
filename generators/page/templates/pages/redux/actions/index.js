/**
 * @file where you organize your actions. <$= pageCreateDate $>
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 */

import { Map } from 'immutable'

const actions = []

const creators = Map()
  .merge(...actions)
  .filter(value => typeof value === 'function')
  .toObject()

export default creators
