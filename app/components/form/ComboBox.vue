<template>
    <div class="flex flex-col gap-2" :class="getColumnWidthClass(colWidth)">
        <Combobox 
            :model-value="model" 
            @update:model-value="model = $event"
            :multiple="props.multiple"
        >
            <FormLabel :required="props.required" :label="props.label" />
            <div class="relative w-full">
                <div 
                    v-if="props.multiple"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-label min-h-[42px]"
                >
                    <div class="flex flex-wrap items-center gap-1 w-[calc(100%_-_1.5rem)]">                        
                        <span 
                            v-for="item in (Array.isArray(model) ? model : [])" 
                            :key="item.id"
                            class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-label rounded text-sm"
                        >
                            {{ item.name }}
                            <button 
                                type="button"
                                @click.stop="removeItem(item)"
                                class="hover:text-blue-600 cursor-pointer"
                            >
                                <FontAwesomeIcon icon="times" class="h-3 w-3" />
                            </button>
                        </span>
                        <ComboboxInput 
                            class="flex-1 min-w-4 outline-none border-none focus:ring-0 p-0"
                            :placeholder="Array.isArray(model) && model.length > 0 ? '' : placeholder"
                            :displayValue="() => ''"
                            @focus="selectAll($event.target as HTMLInputElement)"
                            @change="input = $event.target.value"
                        />
                    </div>
                </div>
                <ComboboxInput 
                    v-else
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-label"
                    :placeholder="placeholder"
                    :displayValue="getDisplayValue"
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
                        v-slot="{ active, selected }"
                        class="px-3 py-2 hover:bg-blue-200 cursor-pointer"
                    >
                        <div class="flex items-center justify-between">
                            <span :class="{ 'font-bold': selected }">
                                {{ option.name }}
                            </span>
                            <FontAwesomeIcon 
                                v-if="selected" 
                                icon="check" 
                                class="h-4 w-4 text-label" 
                            />
                        </div>
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
    search: string | '',
    multiple?: boolean | false
}
const props = defineProps<Props>();
const model = defineModel<Record<string, any> | Record<string, any>[]>();

const input = ref<string>('');

const options = ref<Record<string, any>[]>([]);
const searching = ref<boolean>(false);

onMounted(async () => {
    searching.value = true;
    const url = buildRelativeUrlWithParams(`/${props.search}/select-lists`, {
        search: input.value, page: 1
    });
    const response = await apiFetch<SearchResponse>(url);
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

const getDisplayValue = (item: unknown) => {
    const typedItem = item as Record<string, any> | Record<string, any>[];
    if (props.multiple) {
        // For multi-select, show placeholder or empty string since tags are shown separately
        return (typedItem as Record<string, any>[]).length > 0 ? '' : props.placeholder || '';
    }
    return (typedItem as { id: string | number; name: string })?.name || '';
};

const removeItem = (itemToRemove: Record<string, any>) => {
    if (Array.isArray(model.value)) {
        model.value = model.value.filter(item => item.id !== itemToRemove.id);
    }
};

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
