<template>
  <div class="terms-viewer">
    <a
      v-if="href"
      :href="href"
      class="terms-viewer__link"
    >
      {{ 'assets.download-terms-btn' | globalize }}
    </a>
    <p v-else>
      {{ 'assets.no-terms-msg' | globalize }}
    </p>
  </div>
</template>

<script>
import { Asset } from '../wrappers/asset'

export default {
  name: 'terms-viewer',
  props: {
    asset: { type: Asset, required: true },
    storageUrl: { type: String, required: true },
  },
  computed: {
    href () {
      return this.asset.termsUrl(this.storageUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.terms-viewer__link {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
