import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '../_api'
import { AssetRecord } from '../wrappers/asset.record'
import { SaleRecord } from '../wrappers/sale.record'
import { base, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { Sdk } from '../../../../sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { vuexTypes } from '../../../../vuex'

const OFFER_FEE_TYPE = 'offerFee'

export const state = {
  accountId: '',
  balances: [],
  assets: [],
  accountBalances: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_ACCOUNT_BALANCES_DETAILS] (state, balancesDetails) {
    state.accountBalances = balancesDetails
  },
}

export const actions = {
  async [types.LOAD_BALANCES] ({ commit, getters }) {
    const endpoint = `/v3/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    let response = await api().get('/v3/assets')
    let assets = response.data
    while (response.data.length) {
      response = await response.fetchNext()
      assets = [...assets, ...response.data]
    }

    commit(types.SET_ASSETS, assets)
  },
  /**
   *
   * @param {String} baseAsset - filter sales by base asset code
   */
  async [types.LOAD_SALE_BY_BASE_ASSET] ({ getters }, baseAsset) {
    let { data: sales } = await api().get('/v3/sales', {
      filter: {
        base_asset: baseAsset,
      },
    })

    return sales
      .map(i => new SaleRecord(i))
      .find(i => i.baseAsset.id === baseAsset)
  },

  async [types.LOAD_ACCOUNT_BALANCES_DETAILS] ({ commit, getters }) {
    const accountId = getters.accountId
    const response = await Sdk.horizon.account.getDetails(accountId)
    const balances = response.data.map(balance => {
      balance.assetDetails = new AssetRecord(balance.assetDetails)
      return balance
    })
    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, balances)
  },
  /**
   * @param {object} opts
   * @param {object} opts.pair - pair to create offer for
   * @param {string} opts.pair.base
   * @param {string} opts.pair.quote
   * @param {string} opts.baseAmount
   * @param {string} opts.quoteAmount
   * @param {string} opts.price
   * @param {boolean} opts.isBuy
   * @returns {Promise<void>}
   */
  async [types.CREATE_OFFER] ({ getters, dispatch }, opts) {
    if (!getters.assetDetails(opts.pair.base)) {
      const operation = base.Operation.manageBalance({
        destination: opts.accountId,
        asset: opts.pair.base,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      await api().postOperations(operation)
      dispatch(types.LOAD_ACCOUNT_BALANCES_DETAILS)
    }

    if (!getters.assetDetails(opts.pair.quote)) {
      const operation = base.Operation.manageBalance({
        destination: opts.accountId,
        asset: opts.pair.quote,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      await api().postOperations(operation)
      dispatch(types.LOAD_ACCOUNT_BALANCES_DETAILS)
    }

    const feeType = base.xdr.FeeType.fromName(OFFER_FEE_TYPE).value
    const feeOpts = {
      asset: opts.pair.quote,
      amount: opts.quoteAmount,
      subtype: PAYMENT_FEE_SUBTYPES.outgoing,
      fee_type: feeType,
    }
    const endpoint = `/accounts/${opts.accountId}/calculated_fees`
    const { data: fee } = await api().getWithSignature(endpoint, feeOpts)
    const operationOpts = {
      amount: opts.baseAmount,
      price: opts.price,
      orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
      isBuy: opts.isBuy,
      baseBalance: getters.assetDetails(opts.pair.base).balanceId,
      quoteBalance: getters.assetDetails(opts.pair.quote).balanceId,
      fee: fee.calculatedPercent,
    }
    const operation = base.ManageOfferBuilder.manageOffer(operationOpts)

    await api().postOperations(operation)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assets]: state => state.assets
    .map(a => new AssetRecord(a))
    .filter(a => a.isAllowedToRedeem && a.owner.id !== state.accountId),
  [types.assetsInBalance]: (state, getters) => {
    const balancesCodes = getters[types.balances].map(i => i.assetCode)
    return getters[types.assets].filter(a => balancesCodes.includes(a.code))
  },
  [types.selectedAssetBalance]: (state, getters) => assetCode => {
    return getters[types.balances].find(b => b.assetCode === assetCode).value
  },
  [types.assetDetails]: (state) => (assetCode) => {
    return state.accountBalances.find(i => i.asset === assetCode)
  },
}

export const RedeemFormModule = {
  name: 'redeem-form',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
