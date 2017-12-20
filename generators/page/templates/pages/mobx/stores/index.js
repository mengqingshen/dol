import UIStore from '@common/mobx/store/ui'
import RequestStore from '@common/mobx/store/request'
import MainStore from './main'

export default class {
  constructor() {
    this.requestStore = new RequestStore(this)
    this.uiStore = new UIStore(this)
    this.mainStore = new MainStore(this)
  }
}
