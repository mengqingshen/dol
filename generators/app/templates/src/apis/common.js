/**
 * @author { appAuthorName }, { appAuthorEmail }
 * @file where your common api is defined. { appCreateDate }
 */

/**
 * @file 渠道 CRM > 业务要求
 * @author mengqingshen(mengqingshen_sean@outlook.com), 2017/10/26
 */

import { get } from 'axios'

/**
 * say 
 * this is a demo
 * @param {string} params.keywords 关键字
 * @return {Object}
 */
export const getSomeData = params => get('/api/getSomeData', { params })
