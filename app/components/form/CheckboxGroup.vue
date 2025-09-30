<template>
    <div class="flex flex-col justify-evenly" :class="[
        getColumnWidthClass(props.colWidth),
        props.class
    ]">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    class: {
        type: String,
        default: ''
    },
    colWidth: {
        type: String as () => ColumnWidthOptions,
        default: 'half'
    }
})
</script>
