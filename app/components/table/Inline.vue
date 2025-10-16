<!-- Table Inline -->
<template>
    <div class="overflow-auto" @scroll="tableScrolled($event)">
        <div class="relative box-border min-h-full" :class="{ 'overflow-hidden': tableLoading}">
            <!-- Table Goes Here -->
            <div class="inline-block align-middle min-w-full">
                <TableBase v-if="data.length > 0">
                    <TableHeader :table="table" :loading="tableLoading"/>
                    <TableBody :table="table" :has-more-data="paginated && hasMoreData" :loading-more="tableLoadingMore"
                        :loading="tableLoading"
                    />
                </TableBase>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type ColumnDef, type TableOptionsWithReactiveData, type SortingState,
    getCoreRowModel, useVueTable } from "@tanstack/vue-table";

const props = defineProps<{
    columns: ColumnDef<Record<string, any>, any>[],
    data: Record<string, any>[],
    sortable?: boolean | false,
    paginated: boolean,
    hasMoreData: boolean,
}>();

// TODO: Define emit for sorting when needed
const emit = defineEmits<{
    (e: 'more-data', page: number): void;
    (e: 'sorting', sorting: SortingState): void;
}>();

const tableLoading = ref<boolean>(false);
const tableLoadingMore = ref<boolean>(false);
const data = ref<Record<string, any>[]>(props.data);
const page = ref<number>(1);
const sorting = ref<SortingState>([]);

// Watch for changes in props.data and update the local data ref
watch(() => props.data, (newData) => {
    tableLoadingMore.value = false;
    data.value = newData ?? [];
});


const tableOptions: TableOptionsWithReactiveData<any> = {
    data: data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    // if paginated is true, don't add the getSortedRowModel
    // TODO: Handle sorting generically
    enableSortingRemoval: false,
    enableSorting: props.sortable !== false,
};

const table = useVueTable(tableOptions);

const tableScrolled = (e: Event) => {
    tableScrolledListener(async () => {
        page.value += 1;
        tableLoadingMore.value = true;
        emit('more-data', page.value);
    })(e);
}
</script>
