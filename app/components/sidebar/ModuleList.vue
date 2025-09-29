<template>
    <div class="border-b border-gray-200 p-2">
        <input type="text" name="module_search" id="module_search" placeholder="Search..." 
        class="w-full focus:outline-none font-normal pl-2" v-model="searchTerm"/>
    </div>
    <ul>
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-stone-700 font-normal" 
            :class="{ 
                'bg-dark-blue font-semibold text-white hover:bg-dark-blue!': activeModule === module.name 
            }"
            v-for="module in filteredModuleList" :key="module.name" data-name="module.name"
            @click="goToModule(module.name)">
                <FontAwesomeIcon :icon="module.iconName" class="mr-2"/>
                {{ getModuleDisplayName(module.name) }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    const route = useRoute();
    const activeModule = computed(() => route.path.split('/')[1]);

    const searchTerm = ref<string>('');

    const filteredModuleList = computed(() => {
        let moduleList = getAllModules();
        if (searchTerm.value.trim() === '') {
            return moduleList;
        } else {
            return moduleList.filter(module => 
                getModuleDisplayName(module.name).toLowerCase().includes(searchTerm.value.toLowerCase())
            );
        }
    });

    const goToModule = (moduleName: string) => {
        navigateTo(`/${moduleName}`);
    };
</script>
