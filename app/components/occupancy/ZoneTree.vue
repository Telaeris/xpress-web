<template>
    <div class="font-normal text-sm text-stone-700 -mt-2">
        <div class="flex gap-1 items-center w-full px-2 pt-2">
            <span>
                <FontAwesomeIcon icon="fa-solid fa-map-pin" class="mr-1" />
                <OccupancyTreeLink @click="$emit('zone-selected', null, allZonesName)">All Zones</OccupancyTreeLink>
            </span>
            <span class="text-gray-500">{{ occupancyTotal }}</span>
        </div>
        <div class="ml-2">
            <OccupancyZoneNode 
                v-for="zone in filteredZoneList" 
                :zone="zone" 
                @zone-selected="(zoneId, zoneName) => $emit('zone-selected', zoneId as number, zoneName)"
                @door-selected="(doorId, doorName) => $emit('door-selected', doorId, doorName)"   
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
    nestedZoneList: NestedZoneRecord[];
}>();

defineEmits<{
    (e: 'zone-selected', zoneId: number | null, zoneName: string): void;
    (e: 'door-selected', doorId: number, doorName: string): void;
}>();

const filteredZoneList = computed<NestedZoneRecord[]>(() => {
    return props.nestedZoneList.filter(zone => zone.cardholders && zone.cardholders > 0);
});

const occupancyTotal = computed(() => {
    let total = 0;
    props.nestedZoneList.forEach(zone => {
        total += getTotalOccupancy(zone);
    });
    return total > 0 ? `(${total})` : '';
});
</script>
