<template>
    <thead class="bg-gray-50 sticky top-0 z-20">
        <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="divide-x divide-gray-200"
            >
            <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                scope="col"
                class="p-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap shadow-md z-10"
                :class="{
                    'cursor-pointer select-none hover:bg-gray-200': header.column.getCanSort(),
                    'cursor-wait': loading
                }"
                @click="loading ? '' : header.column.getToggleSortingHandler()?.($event)"
                >
                <div class="flex items-center justify-between">
                    <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                    />
                    <div class="text-gray-400">
                        <FontAwesomeIcon icon="fa-solid fa-sort-up" class="inline-block ml-1 text-gray-700"
                            v-if="header.column.getIsSorted() === 'asc'"/>
                        <FontAwesomeIcon icon="fa-solid fa-sort-down" class="inline-block ml-1 text-gray-700"
                            v-else-if="header.column.getIsSorted() === 'desc'"/>
                        <FontAwesomeIcon icon="fa-solid fa-sort" class="inline-block ml-1"
                            v-else-if="header.column.getCanSort()"/>
                    </div>
                </div>
            </th>
        </tr>
    </thead>
</template>

<script setup lang="ts">
import { type Table, FlexRender } from '@tanstack/vue-table'

defineProps<{
    table: Table<any>,
    loading: boolean
}>()

</script>
