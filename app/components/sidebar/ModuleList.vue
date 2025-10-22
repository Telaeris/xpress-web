<template>
    <div class="border-b border-gray-200 p-2" v-if="!sidebarEditMode">
        <input type="text" name="module_search" id="module_search" placeholder="Search..." 
        class="w-full focus:outline-none font-normal pl-2" v-model="searchTerm"/>
    </div>
    <ul class="overflow-y-auto" v-if="!sidebarEditMode">
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-stone-700 font-normal" 
            :class="{ 
                'bg-dark-blue font-semibold text-white hover:bg-dark-blue!': activeModule === menu.name 
            }"
            v-for="menu in mainMenuList" :key="menu.name" data-name="menu.name"
            @click="goToModule(menu.name)">
                <FontAwesomeIcon :icon="getModuleIconName(menu.name)" class="mr-2"/>
                {{ getModuleDisplayName(menu.name) }}
        </li>
    </ul>
    <ul class="overflow-y-auto " v-else>
        <VueDraggable 
            v-model="updatedModuleList"
            ghost-class="bg-gray-200"    
        >
            <li class="px-4 py-2 hover:bg-gray-100 cursor-move text-stone-700 font-normal border border-gray-400 select-none"
                v-for="module in updatedModuleList" :key="module.name" data-name="module.name"
            >
                <FontAwesomeIcon :icon="module.iconName" class="mr-2"/>
                {{ getModuleDisplayName(module.name) }}
                <input 
                    type="checkbox" 
                    class="float-right mt-1 size-4 accent-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer"
                >
            </li>
        </VueDraggable>
    </ul>

    <!-- Bottom Bar -->
    <div class="bg-dark-blue p-3 text-white text-sm shrink-0 flex justify-center gap-2 mt-auto">
        <template v-if="sidebarEditMode">
            <FontAwesomeIcon icon="fa-solid fa-floppy-disk" size="lg" :class="iconClasses"
                @click="sidebarEditMode = false"/>
            <FontAwesomeIcon icon="fa-solid fa-folder-plus" size="lg" :class="iconClasses"
                @click=""/>
            <FontAwesomeIcon icon="fa-solid fa-arrow-down-a-z" size="lg" :class="iconClasses"
                @click=""/>
            <FontAwesomeIcon icon="fa-solid fa-arrow-down-z-a" size="lg" :class="iconClasses"
                @click=""/>
            <FontAwesomeIcon icon="fa-solid fa-xmark" size="lg" :class="iconClasses"
                @click="sidebarEditMode = false"/>
        </template>
        <template v-else>
            <span>
                Version 0.0.0
            </span>
            <FontAwesomeIcon icon="fa-solid fa-edit" size="lg" :class="iconClasses"
                @click="sidebarEditMode = true"/>
        </template>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VueDraggable } from 'vue-draggable-plus'

const route = useRoute();
const activeModule = computed(() => route.path.split('/')[1]);

const searchTerm = ref<string>('');

const sidebarInfo = useUserSidebarStore();

const mainMenuList = computed(() => {
    let moduleList = sidebarInfo.getMenuItems;
    // base filtering on visibility
    moduleList = moduleList.filter(module => module.vis);
    if (searchTerm.value.trim() === '') {
        return moduleList;
    } else {
        return moduleList.filter(module => 
            getModuleDisplayName(module.name).toLowerCase().includes(searchTerm.value.toLowerCase().trim())
        );
    }
});

const userSidebar = useUserSidebarStore().getMenuItems;

const updatedModuleList = ref<Array<any>>(getAllModules());

const iconClasses = 'cursor-pointer hover:text-gray-100';

const sidebarEditMode = ref<boolean>(false);

const goToModule = (moduleName: string) => {
    navigateTo(`/${moduleName}`);
};
</script>
