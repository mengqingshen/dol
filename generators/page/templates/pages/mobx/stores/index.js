import UIStore from './ui'
import RequestStore from './request'

export default class RootModel {
  constructor() {
    this.requestStore = new RequestStore(this)
    this.uiStore = new UIStore(this)
  }
}
