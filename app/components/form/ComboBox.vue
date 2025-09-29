<template>
    <div class="flex flex-col gap-2" :class="getColumnWidthClass(colWidth)">
        <Combobox :model-value="model" @update:model-value="model = $event">
            <FormLabel :required="props.required" :label="props.label" />
            <div class="relative w-full">
                <ComboboxInput 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-label"
                    :placeholder="placeholder"
                    :displayValue="(item) => (item as { id: string | number; name: string }).name"
                    @focus="selectAll($event.target as HTMLInputElement)"
                    @change="input = $event.target.value"
                />
                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
                    <FontAwesomeIcon icon="chevron-down" class="h-5 w-5 text-gray-400" />
                </ComboboxButton>
                <ComboboxOptions class="absolute w-full z-50 border-r border-l border-b bg-white border-gray-300 rounded-b-md shadow-md max-h-60 overflow-auto">
                    <ComboboxOption
                        v-if="input.length < 2 && options.length === 0 && !searching"
                        disabled
                        class="px-3 py-2 text-gray-500"
                    >
                        Please enter at least 2 characters to search.
                    </ComboboxOption>
                    <ComboboxOption
                        v-else-if="options.length === 0 && !searching"
                        disabled
                        class="px-3 py-2 text-gray-500"
                    >
                        No results found.
                    </ComboboxOption>
                    <ComboboxOption
                        v-else-if="searching"
                        disabled
                        class="px-3 py-2 text-gray-500 animate-pulse"
                    >
                        Searching...
                    </ComboboxOption>
                    <ComboboxOption
                        v-else
                        v-for="option in options"
                        :key="option.id"
                        :value="option"
                        class="px-3 py-2 hover:bg-blue-200 cursor-pointer"
                    >
                        {{ option.name }}
                    </ComboboxOption>
                </ComboboxOptions>
            </div>
        </Combobox>
    </div>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue';

interface Props {
    required?: boolean | false,
    label: string,
    placeholder?: string | '',
    colWidth: ColumnWidthOptions,
    search: string | ''
}
const props = defineProps<Props>();
const model = defineModel<Record<string, any>>();

const input = ref<string>('');

const options = ref<Record<string, any>[]>([]);
const searching = ref<boolean>(false);

onMounted(async () => {
    searching.value = true;
    const url = buildRelativeUrlWithParams(`/core/${props.search}/select-lists`, {
        search: input.value, page: 1
    });
    const response = await $fetch<SearchResponse>(url);
    options.value = response.results.data;
    searching.value = false;
})

interface SearchResponse {
    key: string;
    message: string;
    results: {
        current_page: number;
        data: [{
                id: number;
                name: string;
        }];
    }
}
const selectAll = (input: HTMLInputElement) => input.select();

const searchCombobox = async () => {
    // clear current options
    options.value = [];

    if (input.value.length < 2) {
        return; // Do not search for queries shorter than 2 characters
    }

    if (typeof props.search === 'string' && props.search.length > 0) {
        searching.value = true;
        const url = buildRelativeUrlWithParams(`/core/${props.search}/select-lists`, {
            search: input.value, page: 1
        });
        const response = await $fetch<SearchResponse>(url);
        options.value = response.results.data;
        searching.value = false;
    }
}

watch(input, debounce((newValue) => {
    searchCombobox();
}, 300));
</script>
