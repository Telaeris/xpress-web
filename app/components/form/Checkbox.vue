<template>
    <div class="flex items-center gap-2">
        <input 
            type="checkbox" 
            :checked="model" 
            @change="model = !model" 
            class="size-4 accent-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
        />
        <label class="select-none">{{ props.label }}</label>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
})

const model = defineModel<boolean>();
</script>
