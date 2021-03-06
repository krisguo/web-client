<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="isLoaded">
      <template v-if="!assets.length">
        <h2 class="app__page-heading">
          {{ 'transfer-form.no-assets-heading' | globalize }}
        </h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ 'transfer-form.no-assets' | globalize }}
        </p>
        <router-link
          :to="vueRoutes.assets.name"
          tag="button"
          class="app__button-raised transfer-form__discover-asset-btn">
          {{ 'transfer-form.discover-assets-btn' | globalize }}
        </router-link>
      </template>

      <template
        v-else-if="view.mode === VIEW_MODES.submit ||
          view.mode === VIEW_MODES.confirm">
        <form
          @submit.prevent="processTransfer"
          v-if="view.mode === VIEW_MODES.submit ||
            view.mode === VIEW_MODES.confirm">
          <div class="app__form-row">
            <div class="app__form-field">
              <select-field
                name="transfer-asset"
                :values="assets"
                v-model="form.asset"
                key-as-value-text="nameAndCode"
                :label="'transfer-form.asset-lbl' | globalize"
                :disabled="view.mode === VIEW_MODES.confirm"
              />
              <template v-if="form.asset.code">
                <p class="app__form-field-description">
                  {{
                    'transfer-form.balance' | globalize({
                      amount: balance.balance,
                      asset: form.asset.code,
                      available: balance.balance
                    })
                  }}
                </p>
              </template>
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="transfer-amount"
                :step="config.MINIMAL_NUMBER_INPUT_STEP"
                type="number"
                v-model.trim="form.amount"
                autocomplete="off"
                :label="'transfer-form.amount-lbl' | globalize"
                :readonly="view.mode === VIEW_MODES.confirm"
                @blur="touchField('form.amount')"
                :error-message="getFieldErrorMessage('form.amount', {
                  available: balance.balance
                })"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                name="transfer-recipient"
                v-model.trim="form.recipient"
                :label="'transfer-form.recipient-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.recipient')"
                @blur="touchField('form.recipient')"
                :readonly="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <textarea-field
                name="transfer-description"
                v-model="form.subject"
                :label="'transfer-form.subject-lbl' | globalize({
                  length: 250
                })"
                :maxlength="250"
                :readonly="view.mode === VIEW_MODES.confirm"
              />
            </div>
          </div>

          <transition name="app__fade-in">
            <div
              class="transfer__fee-box"
              v-if="isFeesLoaded">
              <h3 class="transfer__fee-box-heading">
                {{ 'transfer-form.sender-fees' | globalize }}
              </h3>

              <!-- eslint-disable-next-line -->
              <template v-if=" +fees.source.fixed || +fees.source.percent || form.isPaidForRecipient ">
                <p
                  class="transfer__fee"
                  v-if="fees.source.fixed">
                  - {{ fees.source.fixed | formatNumber }}
                  {{ fees.source.asset }}
                  <span class="transfer__fee-type">
                    {{ 'transfer-form.sender-fixed-fee' | globalize }}
                  </span>
                </p>

                <p
                  class="transfer__fee"
                  v-if="fees.source.percent">
                  - {{ fees.source.percent | formatNumber }}
                  {{ fees.source.asset }}
                  <span class="transfer__fee-type">
                    {{ 'transfer-form.sender-percent-fee' | globalize }}
                  </span>
                </p>

                <p
                  class="transfer__fee"
                  v-if="form.isPaidForRecipient && +fees.destination.fixed">
                  - {{ fees.destination.fixed | formatNumber }}
                  {{ fees.destination.asset }}
                  <span class="transfer__fee-type">
                    {{ 'transfer-form.recipient-fixed-fee' | globalize }}
                  </span>
                </p>

                <p
                  class="transfer__fee"
                  v-if="form.isPaidForRecipient && +fees.destination.percent">
                  - {{ fees.destination.percent | formatNumber }}
                  {{ fees.destination.asset }}
                  <span class="transfer__fee-type">
                    {{ 'transfer-form.recipient-percent-fee' | globalize }}
                  </span>
                </p>
              </template>

              <template v-else>
                <p class="transfer__no-fee-msg">
                  {{ 'transfer-form.source-no-fees' | globalize }}
                </p>
              </template>

              <h3 class="transfer__fee-box-heading">
                {{ 'transfer-form.recipient-fees' | globalize }}
              </h3>

              <!-- eslint-disable-next-line max-len -->
              <template v-if="(+fees.destination.fixed || +fees.destination.percent) && !form.isPaidForRecipient">
                <p
                  class="transfer__fee"
                  v-if="fees.destination.fixed">
                  - {{ fees.destination.fixed | formatNumber }}
                  {{ fees.destination.asset }}
                  <span class="transfer__fee-type">
                    {{ 'transfer-form.recipient-fixed-fee' | globalize }}
                  </span>
                </p>

                <p
                  class="transfer__fee"
                  v-if="fees.destination.percent">
                  - {{ fees.destination.percent | formatNumber }}
                  {{ fees.destination.asset }}
                  <span class="transfer__fee-type">
                    {{ 'transfer-form.recipient-percent-fee' | globalize }}
                  </span>
                </p>
              </template>

              <template v-else>
                <p class="transfer__no-fee-msg">
                  {{ 'transfer-form.recipient-no-fees' | globalize }}
                </p>
              </template>

              <h3 class="transfer__fee-box-heading">
                {{ 'transfer-form.total' | globalize }}
              </h3>

              <p class="transfer__fee">
                - {{ totalSenderFee | formatNumber }}
                {{ fees.source.asset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.total-sender-fee' | globalize }}
                </span>
              </p>

              <p class="transfer__fee">
                - {{ totalReceiverFee | formatNumber }}
                {{ fees.destination.asset }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.total-receiver-fee' | globalize }}
                </span>
              </p>

              <p class="transfer__fee">
                - {{ totalAmount | formatNumber }} {{ form.asset.code }}
                <span class="transfer__fee-type">
                  {{ 'transfer-form.total-amount' | globalize }}
                </span>
              </p>

              <!-- eslint-disable-next-line -->
              <div
                class="app__form-row"
                v-if="+fees.destination.fixed || +fees.destination.percent"
              >
                <tick-field v-model="form.isPaidForRecipient">
                  {{ 'transfer-form.pay-fees-for-recipient' | globalize }}
                </tick-field>
              </div>
            </div>
          </transition>

          <div class="app__form-actions">
            <button
              v-ripple
              v-if="view.mode === VIEW_MODES.submit"
              type="submit"
              class="app__form-submit-btn app__button-raised"
              :disabled="formMixin.isDisabled"
            >
              {{ 'transfer-form.continue-btn' | globalize }}
            </button>

            <form-confirmation
              v-if="view.mode === VIEW_MODES.confirm"
              :message="'transfer-form.recheck-form' | globalize"
              :ok-button="'transfer-form.submit-btn' | globalize"
              @cancel="updateView(VIEW_MODES.submit)"
              @ok="submit(form.isPaidForRecipient)"
            />
          </div>
        </form>
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader message-id="transfer-form.loading-msg" />
    </template>

    <template v-else>
      <p>
        {{ 'transfer-form.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'

import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import { vueRoutes } from '@/vue-router/routes'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  base,
  PAYMENT_FEE_SUBTYPES,
  FEE_TYPES,
} from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils'
import config from '@/config'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'
import {
  required,
  emailOrAccountId,
  amount,
  noMoreThanAvailableOnBalance,
} from '@validators'

const VIEW_MODES = {
  submit: 'submit',
  confirm: 'confirm',
}

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'transfers-form',
  components: {
    Loader,
  },
  mixins: [FormMixin, IdentityGetterMixin],
  props: {
    assetToTransfer: { type: String, default: '' },
  },
  data: () => ({
    form: {
      asset: {},
      amount: '',
      recipient: '',
      subject: '',
      isPaidForRecipient: false,
    },
    view: {
      mode: VIEW_MODES.submit,
      opts: {},
    },
    fees: {
      source: {
        fixed: '',
        percent: '',
        feeAsset: '',
      },
      destination: {
        fixed: '',
        percent: '',
        feeAsset: '',
      },
    },
    isLoaded: false,
    isLoadingFailed: false,
    isFeesLoaded: false,
    VIEW_MODES,
    vueRoutes,
    config,
  }),
  validations () {
    return {
      form: {
        amount: {
          required,
          amount,
          noMoreThanAvailableOnBalance:
            noMoreThanAvailableOnBalance(this.balance.balance),
        },
        recipient: { required, emailOrAccountId },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountId,
    ]),
    userTransferableAssets () {
      return this.accountBalances.filter(i => i.assetDetails.isTransferable)
    },
    assets () {
      return this.userTransferableAssets.map(asset => asset.assetDetails)
    },
    balance () {
      return this.accountBalances
        .find(i => i.asset === this.form.asset.code) || {}
    },
    totalSenderFee () {
      return MathUtil.add(this.fees.source.fixed, this.fees.source.percent)
    },
    totalReceiverFee () {
      return MathUtil
        .add(this.fees.destination.fixed, this.fees.destination.percent)
    },
    totalAmount () {
      const fees = this.form.isPaidForRecipient
        ? MathUtil.add(this.totalSenderFee, this.totalReceiverFee)
        : this.totalSenderFee

      return MathUtil.add(fees, this.form.amount)
    },
  },
  async created () {
    try {
      await this.loadCurrentBalances()
      this.setAsset()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorEvent.processWithoutFeedback(e)
    }
  },
  methods: {
    globalize,
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      this.updateView(VIEW_MODES.submit, this.view.opts)
      this.disableForm()
      try {
        await Sdk.horizon.transactions
          .submitOperations(this.buildPaymentOperation())

        Bus.success('transfer-form.payment-successful')
        this.$emit(EVENTS.operationSubmitted)

        await this.loadCurrentBalances()
        this.rerenderForm()
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async processTransfer () {
      if (!await this.isFormValid()) return
      this.disableForm()
      try {
        const recipientAccountId =
          await this.getCounterparty(this.form.recipient)
        const fees = await this.getFees(recipientAccountId)
        this.fees = fees
        this.isFeesLoaded = true

        const opts = {
          amount: this.form.amount,
          destinationAccountId: recipientAccountId,
          destinationFixedFee: fees.destination.fixed,
          destinationPercentFee: fees.destination.percent,
          destinationFeeAsset: fees.destination.feeAsset,
          sourceBalanceId: this.balance.balanceId,
          sourceFixedFee: fees.source.fixed,
          sourcePercentFee: fees.source.percent,
          sourceFeeAsset: fees.source.feeAsset,
          subject: this.form.subject,
          assetCode: this.form.asset.code,
        }
        this.updateView(VIEW_MODES.confirm, opts)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },
    async getCounterparty (recipient) {
      if (!base.Keypair.isValidPublicKey(recipient)) {
        return this.getAccountIdByEmail(recipient)
      } else {
        return recipient
      }
    },
    async getFees (recipientAccountId) {
      const [senderFees, recipientFees] = await Promise.all([
        this.loadPaymentFee({
          asset: this.form.asset.code,
          amount: this.form.amount,
          account: this.accountId,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        }),
        this.loadPaymentFee({
          asset: this.form.asset.code,
          amount: this.form.amount,
          account: recipientAccountId,
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
        }),
      ])
      return {
        source: senderFees,
        destination: recipientFees,
      }
    },
    async loadPaymentFee ({ asset, amount, account, subtype }) {
      try {
        const response = await Sdk.horizon.fees
          .get(FEE_TYPES.paymentFee, { asset, amount, account, subtype })

        return response.data
      } catch (e) {
        ErrorHandler.process(e)
        return {}
      }
    },
    buildPaymentOperation () {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.view.opts.sourceBalanceId,
        destination: this.view.opts.destinationAccountId,
        amount: this.view.opts.amount,
        feeData: {
          sourceFee: {
            percent: this.view.opts.sourcePercentFee,
            fixed: this.view.opts.sourceFixedFee,
          },
          destinationFee: {
            percent: this.view.opts.destinationPercentFee,
            fixed: this.view.opts.destinationFixedFee,
          },
          sourcePaysForDest: this.form.isPaidForRecipient,
        },
        subject: this.view.opts.subject,
        asset: this.form.asset.code,
      })
    },
    updateView (mode, opts = {}, clear = false) {
      this.view.mode = mode
      this.view.opts = opts
      if (clear) {
        this.clearFields()
        this.setAsset()
      }
    },
    rerenderForm () {
      this.updateView(null)
      this.isFeesLoaded = false
      setTimeout(() => this.updateView(VIEW_MODES.submit, {}, true), 1)
    },
    setAsset () {
      this.form.asset =
        this.assets.find(asset => asset.code === this.assetToTransfer) ||
        this.assets[0] ||
        {}
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import "~@scss/variables";

.transfer__fee-box {
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 0.1rem dashed $col-text-field-hint-inactive;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: normal;
  display: block;
  font-size: 1.6rem;
  color: $col-text-page-heading;
}

.transfer__fee-box-heading:not(:first-child) {
  margin-top: 2.5rem;
}

.transfer__fee {
  color: $col-details-value;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 0;
}

.transfer__no-fee-msg {
  color: $col-details-label;
  font-size: 1.6rem;
  line-height: 1.5;
  margin: 1rem 0;
}

.transfer__fee-type {
  color: $col-details-label;
}

.transfer-form__discover-asset-btn {
  margin-top: 2.5rem;
}
</style>
