/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file Store for request. <$= pageCreateDate $>
 */

import axios from 'axios'
import {
  toastError,
  toastSuccess
} from '@helpers/toast'

const ERROR_MSG_OF_PAGE = '网络异常，请稍后再试'
const ERROR_MSG_OF_SERVER = '系统出错，请稍后再试'
const SUCCESS_MSG_OF_SERVER = '操作成功'

const defaultOptions = {
  isDelay: true
}

class MyAxios {
  /**
   * 构造器
   * @param {string="normal"} mode - "noise" 无论成功还是失败都会弹窗, "normal" 只失败的时候弹窗, "silence" 不弹窗
   */
  constructor(rootStore, mode = 'normal', options) {
    this.rootStore = rootStore
    this.instance = this._getInstance()
    this.mode = mode
    this.options = Object.assign({}, defaultOptions, options)
    this._applyInterceptors()
    return this.instance
  }

  /**
   * 获取一个新的 axios 实例
   * @return {Object} axios
   */
  _getInstance() {
    return axios.create({
      validateStatus: status => status >= 200 && status < 300
    })
  }

  _startLoading() {
    this.rootStore.uiStore.doLoading(this.options.isDelay)
  }

  /**
   * 添加拦截器
   */
  _applyInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        this._startLoading()
        return config
      },
      (error) => {
        this.rootStore.uiStore.doUnloading()
        toastError((error && error.response) ? error.response : ERROR_MSG_OF_PAGE)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        this.rootStore.uiStore.doUnloading()
        if (response && response.data) {
          if (response.data.code === 0) {
            if (['noise'].includes(this.mode)) toastSuccess(response.data.msg || SUCCESS_MSG_OF_SERVER)
          } else if (['normal', 'noise'].includes(this.mode)) {
            toastError(response.data.msg || ERROR_MSG_OF_SERVER)
          }
        }
        return response
      },
      (error) => {
        this.rootStore.uiStore.doUnloading()
        if (['normal', 'noise'].includes(this.mode)) toastError(ERROR_MSG_OF_SERVER)
        return Promise.reject(error)
      }
    )
  }
}

export default class RequestStore {
  caches = {}

  modes = ['noise', 'normal', 'silence']

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  create(mode = 'normal', options) {
    if (!this.modes.includes(mode)) {
      throw new Error('valid mode must be one of "noise" "normal" and "silence"')
    }
    if (!this.caches[mode]) this.caches[mode] = new MyAxios(this.rootStore, mode, options)
    return this.caches[mode]
  }
}
