import { Asset } from '../../shared/wrappers/asset'

import { api } from '../_api'
import { types } from './types'

export const state = {
  accountId: '',
  assets: [],
  balances: [],
  kycRequiredAssetType: null,
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, id) {
    state.accountId = id
  },
  [types.SET_ACCOUNT_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_KYC_REQUIRED_ASSET_TYPE] (state, assetType) {
    state.kycRequiredAssetType = assetType
  },
}

export const actions = {
  async [types.LOAD_ACCOUNT_BALANCES] ({ commit, getters }) {
    const endpoint = `/v3/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state', 'balances.asset'],
    })

    commit(types.SET_ACCOUNT_BALANCES, account.balances)
    commit(types.SET_ASSETS, account.balances.map(b => b.asset))
  },

  async [types.LOAD_KYC_REQUIRED_ASSET_TYPE] ({ commit }) {
    const endpoint = '/v3/key_values/asset_type:kyc_required'
    const { data } = await api().get(endpoint)

    commit(types.SET_KYC_REQUIRED_ASSET_TYPE, data.value.u32)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.assets]: state => state.assets.map(asset => {
    const balance = state.balances.find(b => b.asset.id === asset.id) || ''
    return new Asset(asset, balance ? balance.state.available : '')
  }),
  [types.kycRequiredAssetType]: state => state.kycRequiredAssetType,
}

export const balanceExplorerModule = {
  namespaced: true,
  name: 'balance-explorer',
  mutations,
  actions,
  getters,
  state,
}
