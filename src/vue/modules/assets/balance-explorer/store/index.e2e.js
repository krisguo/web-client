import { types } from './types'
import { balanceExplorerModule } from './index'

import { Wallet } from '@tokend/js-sdk'
import * as Api from '../_api'

import Vuex from 'vuex'
import Vue from 'vue'

import { Asset } from '../../shared/wrappers/asset'

Vue.use(Vuex)

describe('balance explorer module end-to-end test', () => {
  let store

  beforeEach(async () => {
    const config = {
      horizonUrl: 'https://test.api.com',
    }
    const wallet = new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    )
    store = new Vuex.Store(balanceExplorerModule)

    Api.initApi(wallet, config)
    sinon.stub(Api.api(), 'getWithSignature').resolves({
      data: {
        balances: [
          {
            state: { available: '10.000000' },
            asset: { id: 'USD' },
          },
          {
            state: { available: '1.000000' },
            asset: { id: 'BTC' },
          },
        ],
      },
    })

    await store.dispatch(types.LOAD_ACCOUNT_BALANCES)
  })

  afterEach(() => {
    Api.api().getWithSignature.restore()
  })

  it('assets', () => {
    const expectedAssets = [
      new Asset({ id: 'USD' }, '10.000000'),
      new Asset({ id: 'BTC' }, '1.000000'),
    ]

    expect(store.getters[types.assets])
      .to.deep.equal(expectedAssets)
  })
})
