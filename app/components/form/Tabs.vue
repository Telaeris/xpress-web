<template>
    <TabGroup :defaultIndex="selectedIndex ?? 0">
        <TabList class="col-span-full flex gap-4 border-b border-gray-100">
            <Tab 
                v-for="(tab, index) in tabs" 
                :key="index" 
                class="font-bold text-primary-hover hover:text-primary cursor-pointer focus:outline-none 
                ui-selected:border-b-2 ui-selected:border-primary ui-selected:text-primary pb-1"
            >
                {{ tab }}
            </Tab>
        </TabList>
        <TabPanels class="col-span-full">
            <TabPanel v-for="(tab, index) in tabs" :key="index">
                <slot :name="tab.toLowerCase().replace(/\s+/g, '-')"></slot>
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';

interface Props {
    tabs: string[];
    selectedIndex?: number;
}

defineProps<Props>();
</script>
