<template>
    <button 
        :class="[
            'cursor-pointer rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
            variantClasses[props.variant || 'primary'],
        ]"
    >
        {{ props.text }}
    </button>
</template>
<script setup lang="ts">
    type ButtonTypes = {
        text: string,
        variant?: 'primary' | 'danger',
        icon?: string,
    }

    const props = defineProps<ButtonTypes>();

    const variantClasses: Record<string, string> = {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        danger: 'bg-main-red text-white hover:bg-red-hover',
    }
</script>
