<template>
  <div class="file-preview">
    <a
      class="file-preview__link"
      v-if="isImage"
      :href="downloadLink"
      target="_blank"
    >
      <img
        class="file-preview__img"
        :src="downloadLink"
        alt=""
      >
    </a>
    <embed
      v-else-if="isPdf"
      class="file-preview__pdf"
      type="application/pdf"
      :src="downloadLink"
    >
    <p v-else>
      {{ 'document-manager.no-preview-msg' | globalize }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'file-preview',
  props: {
    downloadLink: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  computed: {
    isPdf () {
      return this.mimeType === 'application/pdf'
    },
    isImage () {
      return this.mimeType.includes('image')
    },
  },
}
</script>

<style scoped>
.file-preview__link {
  cursor: pointer;
}

.file-preview__pdf {
  width: 100%;
  height: 40rem;
}

.file-preview__img {
  width: 100%;
  object-fit: cover;
}
</style>
