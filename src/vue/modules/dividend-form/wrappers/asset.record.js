import { ASSET_POLICIES } from '@tokend/js-sdk'
import { ASSET_SUBTYPE } from '@/js/const/asset-subtypes.const'
import _get from 'lodash/get'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.id
    this.owner = record.owner.id
    this.name = _get(record, 'details.name')
    this.details = record.details

    this.issued = record.issued

    this.policies = this._policies()
    this.policy = this._policy()

    this.balance = this._getBalance(balances)
  }

  _getBalance (balances) {
    const balance = balances.find(balance => balance.asset === this.code)
    if (balance) {
      return {
        value: balance.available,
        currency: balance.asset,
        id: balance.id,
      }
    } else {
      return {}
    }
  }

  _policies () {
    const policies = this._record.policies.flags || []
    return policies.map(policy => policy.value)
  }

  _policy () {
    return this._policies().reduce((s, p) => s | p, 0)
  }

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }

  get isTransferable () {
    return !!(this.policy & ASSET_POLICIES.transferable)
  }

  get isBaseAsset () {
    return !!(this.policy & ASSET_POLICIES.baseAsset)
  }

  get isShareSubtype () {
    return this.details.subtype === ASSET_SUBTYPE.share
  }
}
