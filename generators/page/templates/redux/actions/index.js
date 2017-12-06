/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file where you organize your actions. <$= pageCreateDate $>
 */

import { Map } from 'immutable'

const actions = []

const creators = Map()
  .merge(...actions)
  .filter(value => typeof value === 'function')
  .toObject()

export default creators
