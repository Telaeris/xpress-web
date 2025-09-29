<!-- A text input component with a two way binding -->
<template>
    <div class="flex flex-col gap-2" :class="getColumnWidthClass(colWidth)">
        <Label :required="props.required" :label="props.label" />
        <input 
            type="text" 
            :placeholder="placeholder" 
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-label"
            :value="model"
            @input="handleInput"
        />
    </div>
</template>
<script setup lang="ts">
    import Label from './Label.vue';
    interface Props {
        required?: boolean | false,
        label: string,
        placeholder?: string | '';
        colWidth: ColumnWidthOptions;
    }

    const props = defineProps<Props>();

    const model = defineModel<string>();

    const handleInput = (event: Event) => {
        model.value = (event.target as HTMLInputElement).value;
    }
</script>
