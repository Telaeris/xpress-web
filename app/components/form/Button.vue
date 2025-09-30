<template>
    <button 
        :class="[
            'cursor-pointer rounded-lg px-4 py-2 focus:outline-none transition-colors',
            (variantClasses[props.variant || 'primary'] ?? {})[props.hollow ? 'hollow' : 'regular'],
            props.class
        ]"
        type="button"
    >
        {{ props.text }}
    </button>
</template>
<script setup lang="ts">
type ButtonVariant = 'primary' | 'success' | 'danger';
const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    variant: {
        type: String as () => ButtonVariant,
        default: 'primary',
    },
    hollow: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: String,
        default: '',
    },
    class: {
        type: String,
        default: '',
    }
});

const variantClasses: Record<string, Record<string, string>> = {
    primary: {
        regular: 'bg-primary text-white hover:bg-primary-hover',
        hollow: 'border border-primary text-primary hover:bg-primary hover:text-white'
    },
    success: {
        regular: 'bg-green-600 text-white hover:bg-green-700',
        hollow: 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
    },
    danger: {
        regular: 'bg-main-red text-white hover:bg-red-hover',
        hollow: 'border border-main-red text-main-red hover:bg-main-red hover:text-white'
    },
}
</script>
