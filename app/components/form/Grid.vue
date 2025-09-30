<!-- 12 column grid, similar to bootstrap -->
<template>
    <div class="grid grid-cols-12 gap-4" :class="props.class">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    class: {
        type: String,
        default: ''
    }
})
</script>
