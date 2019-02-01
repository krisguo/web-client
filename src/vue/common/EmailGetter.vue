<template>
  <span
    class="email-getter"
    :title="result | globalize"
  >
    <template
      v-if="isLoaded"
    >
      {{ result | globalize }}
    </template>
    <template v-else-if="isLoadingFailed">
      &mdash;
    </template>
    <template v-else>
      {{ 'email-getter.loading-msg' | globalize }}
    </template>
  </span>
</template>

<script>
import { Sdk } from '@/sdk'
import config from '@/config'

export default {
  props: {
    accountId: {
      type: String,
      default: '',
    },
    balanceId: {
      type: String,
      default: '',
    },
  },
  data: _ => ({
    result: '',
    isLoaded: false,
    isLoadingFailed: false,
  }),

  async created () {
    if (this.accountId || this.balanceId) {
      await this.loadResult()
      this.isLoaded = true
    } else {
      this.isLoadingFailed = true
    }
  },

  methods: {
    async loadResult () {
      if (this.accountId === Sdk.networkDetails.masterAccountId) {
        this.result = 'email-getter.master-account'
        return
      }
      try {
        const accountId = await this.getAccountId()
        const { data } = await Sdk.api.users.get(accountId)
        this.result = data.email
      } catch (error) {
        if (config.DEBUG) {
          console.error(error)
        }
        this.result = this.accountId || this.balanceId
      }
    },

    async getAccountId () {
      if (this.accountId) {
        return this.accountId
      } else if (this.balanceId) {
        const { data } = await Sdk.horizon.balances.getAccount(this.balanceId)
        return data.accountId
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped>

</style>