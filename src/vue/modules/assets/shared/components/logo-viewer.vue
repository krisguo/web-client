<template>
  <img
    v-if="url"
    :src="url"
    class="logo-viewer logo-viewer--image"
  >
  <p
    v-else
    class="logo-viewer logo-viewer--abbr"
    :class="{ 'logo-viewer--dark' : darkMode }"
  >
    {{ asset.code | abbreviate }}
  </p>
</template>

<script>
import { Asset } from '../wrappers/asset'

export default {
  name: 'logo-viewer',
  props: {
    asset: { type: Asset, required: true },
    storageUrl: { type: String, required: true },
    darkMode: { type: Boolean, default: false },
  },
  computed: {
    url () {
      return this.asset.logoUrl(this.storageUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;

  &--image {
    display: block;
  }

  &--abbr {
    font-size: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $col-asset-logo-background;
    color: $col-asset-logo-text;
  }

  &--dark {
    background: $col-asset-logo-dark-background;
    color: $col-asset-logo-dark-text;
  }
}
</style>
