<!-- DEFAULLT MODULE FOR ALL INDEX PAGES -->
<!-- If you wish to override this entirely, create another named module in the /pages directory -->

<template>
    <div class="flex flex-col h-screen">
        <TopBarWrapper>
            <template v-slot:title>
                {{ moduleDisplayName }}
            </template>
            <template v-slot:leftActions>
                <FontAwesomeIcon icon="fa-solid fa-plus-circle" size="lg" class="text-green-600 cursor-pointer"
                    @click="addNewForm(moduleName)"/>
            </template>
            <template v-slot:rightActions>
                <input v-if="showTable" type="text" name="search_grid" id="search_grid" placeholder="Search..." :disabled="loading"
                    v-model="search" class="px-3 py-1 w-70 max-w-sm focus:outline-none text-md font-normal rounded-full bg-white"/>
            </template>
        </TopBarWrapper>
        <div class="relative flex-1 overflow-auto" ref="container" :class="{ 'overflow-hidden': loading}"
            @scroll="tableScrolledListener(loadMoreData)($event)">
            <Loader :active="loading" :container-ref="container" />
            <!-- Table Goes Here -->
            <TableBase v-if="showTable">
                <TableHeader :table="table" :loading="loading"/>
                <TableBody :table="table" :has-more-data="hasMoreData" :loading-more="loadingMore"
                    :double-click-row-action="(row) => goToFormFromRow(row, moduleName)"
                    :loading="loading"
                />
            </TableBase>
        </div>
        <!-- Table Info Footer -->
        <div v-if='showTable' class="bg-dark-blue p-3 text-white text-sm">
            Showing {{ table.getRowModel().rows.length }} of {{ totalRows }} entries
        </div>

    </div>
</template>


<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useVueTable, getCoreRowModel, type Table, type SortingState } from '@tanstack/vue-table';
import { debounce } from 'lodash-es';


// Module state
const route = useRoute();
const moduleName = computed(() => route.params.module as string);
const moduleDisplayName = useModuleDisplayName(moduleName);

useHead({
    title: `XPTrack - ${moduleDisplayName.value}`,
});

// used to bind to the loader
const container = useTemplateRef<HTMLElement | null>('container');

// tracking variables for pagination
let offset = 0;
const pageStart = offset;
const pageSize = 50; // TODO: Let this page size be dynamic based on user preference

// Loading/visibility state
// const loading = ref<boolean>(true);
const { isLoading: loading, startLoading, stopLoading } = useLoader();
const showTable = ref<boolean>(false);
const loadingMore = ref<boolean>(false);

// Search and sorting state
const search = ref<string>('');
const searchRequestParam = computed(() => search.value ? { search: { value: search.value, regex: '' } } : {});

const sorting = ref<SortingState>([]);
const sortingRequestParam = computed(() => sorting.value.length > 0 ? {
    order: sorting.value.map(sort => ({
        column: tColumns.findIndex(col => col.accessorKey === sort.id),
        dir: sort.desc ? 'desc' : 'asc'
    }))
} : {});

const tData = ref<any[]>([]); // Table data
let tColumns: any[] = []; // Table columns
// const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); TODO: Implement row selection for bulk actions
const totalRows = ref<number>(0);

let table = null as unknown as Table<any>;

const hasMoreData = computed<boolean>(() => {
    return tData.value.length < totalRows.value;
});

/**
 * Initialize the table when mounted
 */
onMounted(async () => {
    startLoading();
    initializeTable();
});

/**
 * Initialize the table when the component is mounted
 */
const initializeTable = async () => {
    const response = await getTableData(moduleName.value, {
        start: pageStart.toString(), length: pageSize.toString(), withColumns: 'true'
    });

    totalRows.value = response.recordsFiltered;
    tColumns = buildColumnsFromResponse(response.columns, moduleName.value);

    sorting.value = response.defaultOrder as SortingState || [];

    table = useVueTable({
        data: tData,
        columns: tColumns,
        getCoreRowModel: getCoreRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        state: {
            get sorting() { return sorting.value; },
            columnVisibility: {
                id: false // Hide the ID column by default
            }
        },
        onSortingChange: (updater) => {
            sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater;
            reloadTable();
        },
        getRowId: (row) => row.id,
        enableSortingRemoval: false,
        enableMultiSort: false,
        manualFiltering: true,
        manualSorting: true,
    });
    
    tData.value = response.data;

    stopLoading(); 
    showTable.value = true;
}

/**
 * Load more data for infinite scrolling
 */
const loadMoreData = async () => {
    loadingMore.value = true;
    offset += pageSize;
    const response = await getTableData(moduleName.value, {
        start: offset.toString(), length: pageSize.toString(), ...searchRequestParam.value, ...sortingRequestParam.value
    });
    tData.value = [...tData.value, ...response.data];
    loadingMore.value = false;
}

/**
 * Clear and reload the tables data from search/sort/filter changes
 */
const reloadTable = async () => {
    startLoading();
    const response = await getTableData(moduleName.value, {
        start: pageStart.toString(), length: pageSize.toString(), ...searchRequestParam.value, ...sortingRequestParam.value
    });
    tData.value = response.data;
    totalRows.value = response.recordsFiltered;
    stopLoading();

    // scroll back to top
    if (container.value) container.value.scrollTop = 0;
};

// listen for search changes and reload the table with a debounce
watch(search, debounce(reloadTable, 600));
</script>
