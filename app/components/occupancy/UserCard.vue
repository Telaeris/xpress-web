<template>
    <div class="border-1 border-gray-200 p-1 flex gap-1 h-fit max-h-40 min-w-fit">
        <img 
            :src="occupancyRecord.image == '' ? noImage : occupancyRecord.image" 
            alt="User" 
            class="object-cover h-16 rounded"
        />
        <div class="flex flex-col text-ellipsis overflow-hidden flex-1">
            <span class="text-xs font-bold truncate">{{ occupancyRecord.user_full_name }}</span>
            <span class="text-xs text-gray-600 truncate">Entered: {{ getEnteredZoneAt(occupancyRecord) }}</span>
            <span class="text-xs text-gray-600 truncate">Zone: {{ occupancyRecord.zone_name }}</span>
            <span class="text-xs text-gray-600 truncate">Time in Zone: {{ getTimeInZone(occupancyRecord) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import noImage from '~/assets/images/noimage.jpg';

defineProps<{
    occupancyRecord: OccupancyRecord
}>();
</script>
