/**
 * @author mengqingshen, mengqingshen_sean@outlook.com
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
  isDelay: true,
  disableLoading: false
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
    if (this.options.disableLoading) return
    this.rootStore.uiStore.doLoading(this.options.isDelay)
  }

  _stopLoading() {
    if (this.options.disableLoading) return
    this.rootStore.uiStore.doUnloading()
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
        this._stopLoading()
        toastError((error && error.response) ? error.response : ERROR_MSG_OF_PAGE)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        this._stopLoading()
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
        this._stopLoading()
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
    const key = mode + JSON.stringify(options)
    if (!this.caches[key]) this.caches[key] = new MyAxios(this.rootStore, mode, options)
    return this.caches[key]
  }
}
