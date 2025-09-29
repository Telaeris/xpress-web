<template>
    <tbody>
        <td v-if="table.getRowModel().rows.length === 0 && !loading" :colspan="table.getAllColumns().length"
            class="p-4 text-center text-gray-500 w-full"
        >
            No records found.
        </td>
        <tr v-for="row in table.getRowModel().rows" :key="row.id" class="odd:bg-white even:bg-gray-200 hover:bg-blue-200"
            @dblclick="doubleClickRowAction?.(row)"
        >
            <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="whitespace-nowrap p-2 text-sm max-w-sm overflow-hidden text-ellipsis font-normal"
            >
                <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                />
            </td>
        </tr>
        <!-- Loading row for pagination -->
        <tr v-if="hasMoreData">
            <td :colspan="table.getAllColumns().length"
                class="h-10">
                <div class="w-full h-full flex align-center justify-center bg-linear-to-t/oklch to-gray-200 from-blue-300"
                    :class="{ 'animate-pulse': loadingMore }">
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script setup lang="ts">
import { type Table, type Row, FlexRender } from '@tanstack/vue-table'

defineProps<{
    table: Table<any>,
    hasMoreData: boolean,
    loading: boolean,
    loadingMore: boolean,
    doubleClickRowAction?: (row: Row<any>) => void,
}>();
</script>
