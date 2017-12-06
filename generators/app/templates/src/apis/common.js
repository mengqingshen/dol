/**
 * @author <$= appAuthorName $>, <$= appAuthorEmail $>
 * @file where your common api is defined. <$= appCreateDate $>
 */

import { get } from 'axios'

/**
 * say 
 * this is a demo
 * @param {string} params.keywords 关键字
 * @return {Object}
 */
export const getSomeData = params => get('/api/getSomeData', { params })
