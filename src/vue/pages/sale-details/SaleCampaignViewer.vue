<template>
  <div class="sale-campaign-viewer">
    <div class="sale-campaign-viewer__content">
      <div class="sale-campaign-viewer__description">
        <sale-logo-viewer :sale="sale" />
        <sale-description-viewer :sale="sale" />
      </div>

      <div class="sale-campaign-viewer__state">
        <submodule-importer
          v-if="getModule().canRenderSubmodule(SaleStateWidgetPseudoModule)"
          :submodule="getModule().getSubmodule(SaleStateWidgetPseudoModule)"
          :sale="sale"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SaleLogoViewer from './SaleLogoViewer'
import SaleDescriptionViewer from './SaleDescriptionViewer'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { SaleStateWidgetPseudoModule } from '@/modules-arch/pseudo-modules/sale-state-widget-pseudo-module'

export default {
  name: 'sale-campaign-viewer',
  components: {
    SaleLogoViewer,
    SaleDescriptionViewer,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: () => ({
    SaleStateWidgetPseudoModule,
  }),
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.sale-campaign-viewer {
  margin-top: 2.4rem;
}

.sale-campaign-viewer__content {
  display: flex;
  align-items: flex-start;
  margin: -1.6rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.sale-campaign-viewer__description {
  flex-basis: 64%;
  background-color: $col-sale-details-block;
  border-radius: .4rem;
  margin: 1.6rem;
  overflow: auto;

  @include respond-to($x-medium) {
    flex-basis: 55%;
  }
}

.sale-campaign-viewer__state {
  flex-basis: 36%;
  background-color: $col-sale-details-block;
  border-radius: .4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;

  @include respond-to($x-medium) {
    flex-basis: 45%;
  }
}
</style>
