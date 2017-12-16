import UIStore from './ui'
import RequestStore from './request'
import MainStore from './main'

export default class {
  constructor() {
    this.requestStore = new RequestStore(this)
    this.uiStore = new UIStore(this)
    this.mainStore = new MainStore(this)
  }
}
