import UIStore from './ui-store'
import RequestStore from './request-store'

export default class RootModel {
  constructor() {
    this.requestStore = new RequestStore(this)
    this.uiStore = new UIStore(this)
  }
}
