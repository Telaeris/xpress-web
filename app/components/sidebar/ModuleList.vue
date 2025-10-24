<template>
    <div class="border-b border-gray-200 p-2" v-if="!sidebarEditMode">
        <input type="text" name="module_search" id="module_search" placeholder="Search..." 
        class="w-full focus:outline-none font-normal pl-2" v-model="searchTerm"/>
    </div>
    <ul class="overflow-y-auto" v-if="!sidebarEditMode">
        <template v-for="(menu, index) in mainMenuList" :key="index">
            <Disclosure :default-open="checkIfActiveModuleInMenu(menu)">
                <li class="flex items-center gap-2 px-4 py-2 cursor-pointer text-stone-700 font-normal hover:bg-gray-100" 
                    :class="{ 
                        'bg-dark-blue font-semibold text-white hover:bg-dark-blue!': activeModule === menu.name,
                    }"
                    @click="menu.module ? goToModule(menu.name): null"
                >
                        <template v-if="menu.module">
                            <FontAwesomeIcon :icon="getModuleIconName(menu.name)"/>
                            {{ getModuleDisplayName(menu.name) }}
                        </template>
                        <template v-else>
                            <DisclosureButton v-slot="{ open }" class="flex items-center gap-2 w-full cursor-pointer">
                                <FontAwesomeIcon icon="fa-solid fa-folder-open" class="flex-shrink-0"/>
                                {{ menu.name }}
                                <FontAwesomeIcon 
                                    icon="fa-solid fa-chevron-down"
                                    class="flex-shrink-0 ml-auto cursor-pointer hover:text-gray-700 focus-visible:outline-none transition-transform duration-200"
                                    :class="{ 'rotate-180': open }"
                                />
                            </DisclosureButton>
                        </template>
                </li>
                <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform -translate-y-2 opacity-0"
                    enter-to-class="transform translate-y-0 opacity-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform translate-y-0 opacity-100"
                    leave-to-class="transform -translate-y-2 opacity-0"
                >
                    <DisclosurePanel class="ml-4">
                        <li class="flex items-center gap-2 px-4 py-2 cursor-pointer text-stone-700 font-normal" 
                            :class="{ 
                                'bg-dark-blue font-semibold text-white hover:bg-dark-blue!': activeModule === subMenu.name,
                                'hover:bg-gray-100': subMenu.module
                            }"
                            v-for="(subMenu, index) in menu.kids" :key="subMenu.name || index" data-name="subMenu.name"
                            @click="subMenu.module ? goToModule(subMenu.name): null"
                        >
                            <FontAwesomeIcon :icon="getModuleIconName(subMenu.name)"/>
                            {{ getModuleDisplayName(subMenu.name) }}
                        </li>                
                    </DisclosurePanel>
                </transition>
            </Disclosure>
        </template>
    </ul>
    <ul class="overflow-y-auto " v-else>
        <VueDraggable 
            v-model="updatedMenuList"
            group="menus"
            :animation="150"
            ghost-class="bg-gray-200"
            :revert-on-spill="true"
            @spill="deleteFoldersOnSpill"
        >
            <template v-for="(menu, index) in updatedMenuList" :key="menu.id || index">
                <Disclosure :default-open="true" as="div" class="top-level">
                    <li class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-move
                        text-stone-700 font-normal border border-gray-400 select-none"
                    >
                        <template v-if="menu.module">
                            <FontAwesomeIcon :icon="getModuleIconName(menu.name)" class="flex-shrink-0"/>
                            <span class="flex-1 min-w-0 truncate">
                                {{ getModuleDisplayName(menu.name) }}
                            </span>
                            <input 
                                type="checkbox" 
                                class="flex-shrink-0 size-4 accent-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer"
                                v-model="menu.vis"
                            >
                        </template>
                        <template v-else>
                            <FontAwesomeIcon icon="fa-solid fa-folder-open" class="flex-shrink-0"/>
                            <input 
                                type="text" 
                                class="flex-1 min-w-0 p-1 truncate bg-transparent focus:outline-none border border-gray-300 rounded-xl"
                                v-model="menu.name"
                                @click.stop
                                @mousedown.stop
                                @keydown.stop
                                :id="`folderNameInput-${index}`"
                                :name="`folderNameInput-${index}`"
                            />
                            <DisclosureButton v-slot="{ open }" class="flex items-center gap-2">
                                <FontAwesomeIcon 
                                    :icon="open ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
                                    class="flex-shrink-0 cursor-pointer hover:text-gray-700 focus-visible:outline-none"
                                />
                            </DisclosureButton>
                        </template>
                    </li>
                    <DisclosurePanel v-if="!menu.module" :key="reloadDisclosure">
                        <VueDraggable
                            :animation="150"
                            v-model="menu.kids"
                            group="menus"
                            ghost-class="bg-gray-200"
                            :remove-clone-on-hide="false"
                            class="border-l border-gray-300 ml-4"
                            @remove="clearNestedMenus($event, menu)"
                        >
                            <template
                                v-if="menu.kids.length > 0" 
                                v-for="(subMenu, subIndex) in menu.kids" :key="subIndex"
                            >
                                <li class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-move font-normal text-stone-700 border border-gray-400">
                                    <FontAwesomeIcon :icon="getModuleIconName(subMenu.name)" class="flex-shrink-0"/>
                                    <span class="flex-1 min-w-0 truncate">
                                        {{ getModuleDisplayName(subMenu.name) }}
                                    </span>
                                    <input 
                                        type="checkbox" 
                                        class="flex-shrink-0 size-4 accent-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer"
                                        v-model="subMenu.vis"
                                    >
                                </li>
                            </template>
                            <template v-else>
                                <li class="px-4 py-2 text-gray-500 italic">
                                    Drag Modules Here. Drag Folder Outside Sidebar to Delete.
                                </li>
                            </template>
                        </VueDraggable>
                    </DisclosurePanel>
                </Disclosure>
            </template>        
        </VueDraggable>
    </ul>

    <!-- Bottom Bar -->
    <div class="bg-dark-blue p-3 text-white text-sm shrink-0 flex justify-center gap-2 mt-auto">
        <template v-if="sidebarEditMode">
            <FontAwesomeIcon icon="fa-solid fa-floppy-disk" size="lg" :class="iconClasses"Muster
                @click="saveEditedMenus()"/>
            <FontAwesomeIcon icon="fa-solid fa-folder-plus" size="lg" :class="iconClasses"
                @click="addMenuFolder()"/>
            <FontAwesomeIcon icon="fa-solid fa-arrow-down-a-z" size="lg" :class="iconClasses"
                @click="sortMenusAlpha('asc')"/>
            <FontAwesomeIcon icon="fa-solid fa-arrow-down-z-a" size="lg" :class="iconClasses"
                @click="sortMenusAlpha('desc')"/>
            <FontAwesomeIcon icon="fa-solid fa-xmark" size="lg" :class="iconClasses"
                @click="cancelEditedMenus"/>
        </template>
        <template v-else>
            <span>
                Version 0.0.0
            </span>
            <FontAwesomeIcon icon="fa-solid fa-edit" size="lg" :class="iconClasses"
                @click="startEditMode()"/>
        </template>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/vue';
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'

const route = useRoute();
const activeModule = computed(() => route.path.split('/')[1]);

const searchTerm = ref<string>('');

const reloadDisclosure = ref<number>(0);

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

const updatedMenuList = ref<UserSidebarMenuItem[]>([]);

const iconClasses = 'cursor-pointer hover:text-gray-100';

const sidebarEditMode = ref<boolean>(false);

const startEditMode = () => {
    let storedMenusCopy = sidebarInfo.getMenuItems;
    // push all of the non-visible menus to the end of the list
    storedMenusCopy.sort((a, b) => {
        if (a.vis === b.vis) return 0;
        return a.vis ? -1 : 1;
    });
    updatedMenuList.value = JSON.parse(JSON.stringify(sidebarInfo.getMenuItems));
    sidebarEditMode.value = true;
}

const cancelEditedMenus = () => {
    withConfirm('Are you sure you want to discard your changes?', () => {
        updatedMenuList.value = [];
        sidebarEditMode.value = false;
    })
}

const saveEditedMenus = () => {
    sidebarInfo.setMenuItems(updatedMenuList.value, true);
    sidebarEditMode.value = false;
}

const sortMenusAlpha = (order: 'asc' | 'desc') => {
    updatedMenuList.value.sort((a, b) => {
        const nameA = getModuleDisplayName(a.name).toLowerCase();
        const nameB = getModuleDisplayName(b.name).toLowerCase();
        if (nameA < nameB) return order === 'asc' ? -1 : 1;
        if (nameA > nameB) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

const addMenuFolder = async () => {
    const newFolderName = 'New Folder';
    updatedMenuList.value = [
        { name: newFolderName, module: false, vis: true, kids: [] },
        ...updatedMenuList.value
    ];

    await nextTick();

    // focus the newly created folder
    const folderInput = document.querySelector(`[name="folderNameInput-0"]`) as HTMLInputElement;
    if (folderInput) {
        folderInput.focus();
        folderInput.select();
    }
}

const deleteFoldersOnSpill = (event: SortableEvent) => {
    const item = updatedMenuList.value[event.oldIndex!];
    if (item !== undefined && !item.module && (!item.kids || item.kids.length === 0)) {
        updatedMenuList.value.splice(event.oldIndex!, 1);
    }
}

const clearNestedMenus = (event: SortableEvent, menu: UserSidebarMenuItem) => {
    if (menu.kids.length === 0) {
        reloadDisclosure.value += 1;
    }
}

const checkIfActiveModuleInMenu = (menu: UserSidebarMenuItem): boolean => {
    if (menu.module || menu.kids == undefined) { return false; }
    for (const subMenu of menu.kids) {
        if (subMenu.name === activeModule.value) {
            return true;
        }
    }
    return false;
}

const goToModule = (moduleName: string) => {
    navigateTo(`/${moduleName}`);
};
</script>
