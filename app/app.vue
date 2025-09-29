<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { theme } = useTheme();

  useHead({
    htmlAttrs: {
      'data-theme': theme.value
    }
  });
</script>
