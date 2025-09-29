<template>
    <div class="ml-2 border-l border-gray-300 text-center">
        <Disclosure :default-open="true" v-slot="{ open }">
            <div class="flex gap-1 items-center w-full px-2 pt-2">
                <span>
                    <DisclosureButton v-if="zone.children.length > 0 && allDoors.length > 0">
                        <FontAwesomeIcon 
                            :icon="open ? 'fa-solid fa-minus' : 'fa-solid fa-plus'" size="xs" 
                            class="text-gray-500 mr-1 border-1 border-gray-300 size-[12px]! p-[0.5px] cursor-pointer" 
                        />
                    </DisclosureButton>
                    <FontAwesomeIcon icon="fa-solid fa-map-pin" class="mr-1" />
                    <OccupancyTreeLink @click="$emit('zone-selected', zone.id, zone.name)">{{ zone.name }}</OccupancyTreeLink>
                </span>
                <span class="text-gray-500">{{ zoneOccupancyCount }}</span>
            </div>
            <DisclosurePanel>
                <div class="flex flex-col ml-2">
                    <!-- Door Links -->
                    <div 
                        v-for="door in allDoors" 
                        :key="(door.id as number)" 
                        class="flex ml-2 border-l border-gray-300 px-2 pt-2"
                    >
                        <FontAwesomeIcon icon="fa-solid fa-door-open" class="mr-1" />
                        <OccupancyTreeLink 
                            @click="$emit('door-selected', door.id, door.name)"
                        >
                            {{ door.name }}
                        </OccupancyTreeLink>
                    </div>
                    <OccupancyZoneNode 
                        v-for="childZone in zone.children" 
                        :key="(childZone.id as number)" 
                        :zone="childZone" 
                        @zone-selected="(zoneId, zoneName) => $emit('zone-selected', zoneId, zoneName)"
                        @door-selected="(doorId, doorName) => $emit('door-selected', doorId, doorName)"
                    />
                </div>
            </DisclosurePanel>
        </Disclosure>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

const props = defineProps<{
    zone: NestedZoneRecord;
}>();

defineEmits<{
    (e: 'zone-selected', zoneId: number, zoneName: string): void;
    (e: 'door-selected', doorId: number, doorName: string): void;
}>();

const zoneOccupancyCount = computed(() => {
    let thisCount = props.zone.cardholders as number;
    props.zone.children.forEach(child => {
        thisCount += child.cardholders as number;
    });

    return thisCount > 0 ? `(${thisCount})` : '';
});

const allDoors = computed<{id: number, name: string}[]>(() => {
    let doors: {id: number, name: string}[] = [];
    if (props.zone.start_doors && props.zone.start_doors.length > 0) {
        doors = doors.concat(props.zone.start_doors);
    } 
    if (props.zone.end_doors && props.zone.end_doors.length > 0) {
        doors = doors.concat(props.zone.end_doors);
    }
    return doors;
});
</script>
