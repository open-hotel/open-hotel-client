import { MobiDefinition } from '@open-hotel/core'
import { Api } from './Api'

const api = new Api('mobi')

export default {
  getInventory (): Promise<MobiDefinition[]> {
    return api.get<MobiDefinition[]>('inventory')
  }
}
