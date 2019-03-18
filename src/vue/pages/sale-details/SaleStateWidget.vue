<template>
  <div class="sale-state-widget">
    <drawer :is-shown.sync="isOverviewDrawerShown">
      <template slot="heading">
        {{ 'sale-details.overview-title' | globalize }}
      </template>

      <sale-overview :sale="sale" />
    </drawer>

    <submodule-importer
      v-if="getModule().canRenderSubmodule(SaleStateWidgetChartPseudoModule)"
      :submodule="getModule().getSubmodule(SaleStateWidgetChartPseudoModule)"
      :sale="sale"
    />

    <p class="sale-state-widget__invested">
      <!-- eslint-disable-next-line max-len -->
      {{ { value: sale.currentCap, currency: sale.defaultQuoteAsset } | formatMoney }}
    </p>

    <p class="sale-state-widget__funded">
      <!-- eslint-disable-next-line max-len -->
      {{ 'sale-details.funded' | globalize({ funded: sale.currentCap / sale.hardCap }) }}
    </p>

    <div class="sale-state-widget__progress-bar">
      <div
        class="sale-state-widget__progress"
        :style="`width: ${sale.hardCapProgress}%`"
      />
    </div>

    <vue-markdown
      class="sale-state-widget__investors"
      :source="'sale-details.investors' | globalize({
        investors: sale.investors
      })"
    />

    <vue-markdown
      class="sale-state-widget__days-to-go"
      :source="'sale-details.days-to-go' | globalize({
        days: sale.daysToGo
      })"
    />

    <button
      v-ripple
      class="app__button-raised sale-state-widget__overview-btn"
      @click="isOverviewDrawerShown = true"
    >
      {{ 'sale-details.view-details-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import Drawer from '@/vue/common/Drawer'

import SaleOverview from './SaleOverview'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { SaleStateWidgetChartPseudoModule } from '@/modules-arch/pseudo-modules/sale-state-widget-pseudo-module'

export default {
  name: 'sale-state-widget',
  components: {
    Drawer,
    VueMarkdown,
    SaleOverview,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isOverviewDrawerShown: false,
    SaleStateWidgetChartPseudoModule,
  }),
}
</script>

<style lang="scss">
@import "~@scss/variables";

.sale-state-widget__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: $col-sale-details-progress-bar-bg;

  .sale-state-widget__progress {
    background: $col-sale-details-progress-bar-funded;
    height: 100%;
  }
}

.sale-state-widget__invested {
  font-size: 2.4rem;
  color: $col-sale-details-text-primary;
}

.sale-state-widget__funded {
  font-size: 1.4rem;
  color: $col-sale-details-text-secondary;
}

.sale-state-widget__investors, .sale-state-widget__days-to-go {
  h3 {
    font-size: 2.4rem;
    font-weight: normal;
    color: $col-sale-details-text-primary;
  }

  p {
    font-size: 1.4rem;
    color: $col-sale-details-text-secondary;
  }
}

.sale-state-widget__investors {
  margin-top: 2.4rem;
}

.sale-state-widget__days-to-go {
  margin-top: 1.6rem;
}

.sale-state-widget__overview-btn {
  margin-top: 3.2rem;
  max-width: 18rem;
  width: 100%;
}
</style>
