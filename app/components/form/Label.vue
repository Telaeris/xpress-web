<template>
    <span class="text-label font-bold">
        {{ label }}
        <span v-if="props.required" class="text-red-400">*</span>
    </span>
</template>

<script setup lang="ts">
    interface Props {
        required?: boolean | false,
        label: string,
    }

    const props = defineProps<Props>();
</script>
