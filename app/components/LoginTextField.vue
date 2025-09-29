<template>
    <input :type=getTypeFromPlaceholder() class="rounded-sm border-main-gray border w-full p-1 font-normal text-neutral-800 
        focus:shadow-(color:main-blue) focus:shadow-md focus:outline-none focus:border-main-blue" 
        :placeholder=placeholder :value=modelValue @input="$emit('update:modelValue', ((<HTMLInputElement>$event.target)?.value || ''))" />
</template>

<script setup lang="ts">
    const emits = defineEmits(['update:modelValue']);
    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Username/Email'
        },
        modelValue: {
            type: String,
            required: true
        }
    });

    const getTypeFromPlaceholder = () => {
        if (props.placeholder.toLowerCase().includes('password')) {
            return 'password';
        }
        return 'text';
    };
</script>
