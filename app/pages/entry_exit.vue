<!-- Occupancy Page -->
<template>
    <div class="relative size-full" ref="containerRef">
        <Loader :active="isLoading" :container-ref="containerRef"/>
        <div class="flex flex-row h-full">
            <div class="flex-none flex flex-col gap-3 min-w-60 p-4 border-r border-gray-300">
                <div class="h-fit bg-gray-400 p-1">
                    <input type="text" name="search" id="search"
                        class="font-normal text-md w-full rounded-full px-3 py-1 bg-white focus:outline-none"
                        placeholder="Search" v-model="occupancySearch"/>
                </div>
                <FormLabel label="Occupancy" />
                <OccupancyZoneTree
                    :nestedZoneList="nestedZoneList"
                    @zone-selected="handleZoneSelectedInTree"
                    @door-selected="handleDoorSelectedInTree($event)"
                />
            </div>
            <div class="flex flex-col w-full min-h-0 min-w-0">
                <div class="flex-1 flex p-4 flex-col gap-2 min-h-0 min-w-0">
                    <div class="flex flex-row gap-4">
                        <FormLabel :label="occupancyLabel" />
                        <FormLabel :label="occupancyCardView ? 'Table View' : 'Card View'" 
                            class="cursor-pointer text-blue-600 hover:underline"
                            @click="occupancyCardView = !occupancyCardView"
                        />
                        <!-- TODO: Add Other buttons -->
                    </div>
                    <OccupancyCardContainer v-if="occupancyCardView">
                        <OccupancyUserCard 
                            v-for="record in occupancyList" 
                            :key="record.id" 
                            :occupancyRecord="record" 
                        />
                    </OccupancyCardContainer>
                    <TableInline
                        v-else
                        :data="occupancyList"
                        :paginated="false"
                        :columns="(occupancyTableColumns as ColumnDef<Record<string, any>, any>[])"
                        :sortable="false"
                        :has-more-data="false"
                    />
                </div>
                <!-- Activity section -->
                <div class="flex-1 flex flex-col gap-2 p-4 border-t border-gray-300 min-h-0 min-w-0">
                    <div class="flex flex-row justify-between gap-4 items-center flex-shrink-0">
                        <FormLabel label="Activity Occuring in Last 7 Days" />
                        <!-- TODO: Add Other buttons -->
                        <FormLabel :label="badgeActivityData.length > 0 ? badgeActivityData.length.toString() : ''" />
                    </div>

                    <!-- Scrollable table container -->
                    <TableInline
                        v-if="pageLoaded"
                        paginated
                        :data="badgeActivityData"
                        :columns="badgeActivityColumns"
                        :sortable="false"
                        :has-more-data="badgeActivityData.length < totalBadgeActivities"
                        @more-data="getBadgeActivity($event)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type ColumnDef } from '@tanstack/vue-table';
import { format } from 'date-fns';
import { debounce } from 'lodash-es';
import noImage from '~/assets/images/noimage.jpg';

useSeoMeta({
    title: 'XPTrack - Occupancy',
});

const occupancyPageLimit = 20;

const { isLoading, startLoading, stopLoading } = useLoader();

const pageLoaded = ref(false);
const occupancyCardView = ref(true);

const occupancyList = ref<OccupancyRecord[]>([]);
const nestedZoneList = ref<NestedZoneRecord[]>([]);
const badgeActivityData = ref<Record<string, any>[]>([]);
const totalBadgeActivities = ref<number>(0);

const occupancySearch = ref<string>('');

const currentZone = ref<{
    id: number | null;
    name: string;
}>({
    id: null,
    name: allZonesName
});

const occupancyLabel = computed(() => {
    console.log(occupancyList.value.length);
    return `${currentZone.value.name}: ${!isLoading.value ? occupancyList.value.length : ''}`;
});

onMounted(async () => {
    // fetch the nested zone list
    startLoading();

    // get nested zone list and occupant list
    Promise.all([
        apiFetch<{ results: NestedZoneRecord[] }>('/nested-zone-list'),
        getOccupants(),
        getBadgeActivity(),
    ]).then(([zoneResponse]) => {
        nestedZoneList.value = zoneResponse.results;
        pageLoaded.value = true;
        stopLoading();
    });
});

const getBadgeActivity = async (page?: number) => {
    // fetch the badge activity for the last 7 days
    const url = buildRelativeUrlWithParams('/entry-exit-badge-activities', {
        limit: 20,
        page: page ?? 1,
        search: '',
    });
    const response = await apiFetch<{ results: {total: number, data: Record<string, any>[]} }>(url);
    if (page && page > 1) {
        badgeActivityData.value = [...badgeActivityData.value, ...response.results.data];
    } else {
        badgeActivityData.value = response.results.data;
    }
    totalBadgeActivities.value = response.results.total;
};

const getOccupants = async () => {
    // fetch the occupancy list based on currentZone
    occupancyList.value = [];
    occupancyList.value = await fetchEntryExitCardholders({
        limit: occupancyPageLimit,
        page: 1,
        search: occupancySearch.value,
        ...(currentZone.value?.id ? { zone_id: currentZone.value.id } : {})
    })
}

watch(occupancySearch, debounce(async () => {
    startLoading();
    await getOccupants();
    stopLoading();
}, 300));

const containerRef = useTemplateRef('containerRef');

const occupancyTableColumns: ColumnDef<OccupancyRecord, any>[] = [
    {
        header: 'User',
        accessorKey: 'user_full_name',
    },
    {
        header: 'Photo',
        accessorKey: 'image',
        cell: props => {
            const imagePath = props.getValue() === '' ? noImage : props.getValue();
            return h('img', {
                src: imagePath,
                class: 'w-10 h-10 rounded-full object-cover',
                alt: 'User Photo',
            });
        },
    },
    {
        header: 'Entered',
        accessorKey: 'entered_zone_at',
        cell: ({ row }) => getEnteredZoneAt(row.original),
    },
    {
        header: 'Zone',
        accessorKey: 'zone_name',
    },
    {
        header: 'Time in Zone',
        accessorKey: 'time_in_zone',
        cell: ({ row }) => getTimeInZone(row.original),
    }
]

const badgeActivityColumns: ColumnDef<Record<string, any>, any>[] = [
    {
        header: 'User',
        accessorKey: 'user_full_name',
        cell: info => info.getValue(),
    },
    {
        header: 'Photo',
        accessorKey: 'image',
        cell: props => {
            const imagePath = props.getValue() === '' ? noImage : props.getValue();
            return h('img', {
                src: imagePath,
                class: 'w-10 h-10 rounded-full object-cover',
                alt: 'User Photo',
            });
        },
    },
    {
        header: 'Timestamp',
        accessorKey: 'timestamp',
        cell: info => format(new Date(info.getValue()), 'yyyy/MM/dd HH:mm:ss'),
    },
    {
        header: 'Start Zone',
        accessorKey: 'start_zone_name',
    },
    {
        header: 'End Zone',
        accessorKey: 'end_zone_name',
    },
    {
        header: 'Door',
        accessorKey: 'door_name',
    },
    {
        header: 'Entry Granted',
        accessorKey: 'entry_granted',
        cell: info => info.getValue() ? 'Yes' : 'No',
    }
];


const handleZoneSelectedInTree = async (zoneId: number | null, zoneName: string) => {
    currentZone.value = { id: zoneId, name: zoneName };
    startLoading();
    await getOccupants();
    stopLoading();
}

const handleDoorSelectedInTree = (event: number) => {
    console.log('Door selected in tree:', event);
}
</script>
