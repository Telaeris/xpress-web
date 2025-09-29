<script setup lang="ts">
import Confirm from '~/components/dialog/Confirm.vue';
</script>

<template>
    <div class="flex flex-row w-screen h-screen">
        <aside class="w-70 flex-none flex flex-col border-r border-gray-200">
            <SidebarTopCard />
            <SidebarModuleList />
        </aside>
        <div class="flex-1 bg-white overflow-auto">
            <slot></slot>
        </div>
    </div>
    <!-- Global Dialogs -->
    <Confirm />
</template>
