/**
 * @author <$= pageAuthorName $>, <$= pageAuthorEmail $>
 * @file store for global loading. <$= pageCreateDate $>
 */

import { observable, action } from 'mobx'
import _ from 'lodash'

export default class UIStore {
  @observable loadQueue = 0
  @observable isLoading = false

  dealyId = 0

  @action('延迟判断 loading')
  delaySetLoading() {
    this.dealyId = _.delay(() => {
      this.setLoading()
    }, 300, 'later')
  }

  @action('立即判断 loading')
  setLoading() {
    this.isLoading = this.loadQueue > 0
  }

  @action('开始 loading')
  doLoading(isDelay = true) {
    this.loadQueue = this.loadQueue + 1
    if (isDelay) this.delaySetLoading()
    else this.setLoading()
  }

  @action('结束 loading')
  doUnloading() {
    this.loadQueue = this.loadQueue - 1
    this.setLoading()
  }
}
