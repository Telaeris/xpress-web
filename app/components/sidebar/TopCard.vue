<template>
    <div class="bg-dark-blue p-4 flex flex-col gap-2">
        <div class="flex justify-between">
            <img :src="getMainLogoPath" alt="" class="w-4/5 object-scale-down" />
            <img src="~/assets/icons/sidebar_toggler_icon_darkblue.png" alt="" 
                class=" w-6 object-scale-down cursor-pointer hover:opacity-25"/>
        </div>
        <div class="group text-white text-[0.9rem] font-normal inline-block cursor-pointer" @click="toggleMenu" v-on-click-outside="hideMenuIfVisible">
            <img src="~/assets/icons/no_image.svg" alt="" class="inline w-4 object-scale-down w-8 mr-1"/>
            {{ $t('welcome', { name: 'Brady Schiller'}) }}
            <FontAwesomeIcon :icon="`fa-solid fa-chevron-${showMenu ? 'up' : 'down'}`" class="group-hover:opacity-25 cursor-pointer"/>
            <DropdownMenu v-if="showMenu" :options="refMenu" class="w-55" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    const { getMainLogoPath } = useTheme();

    const { getLocaleCookie, setLocale } = useI18n();

    const showMenu = ref(false);
    const hideMenuIfVisible = () => {
        if (showMenu.value) {
            showMenu.value = false;
        }
    };
    const toggleMenu = () => {
        showMenu.value = !showMenu.value;
    };

    const switchLocaleBasedOnActive = () => {
        const currentLocale = getLocaleCookie();
        if (currentLocale === 'en') {
            setLocale('es');
        } else {
            setLocale('en');
        }
    };

    const refMenu = ref([
        { icon: 'fa-solid fa-user', label: 'Profile', action: () => { console.log('Profile clicked'); }},
        { icon: 'fa-solid fa-gear', label: 'Settings', action: () => { navigateTo('/settings') } },
        { icon: 'fa-solid fa-right-from-bracket', label: 'Logout', action: () => { navigateTo('/login') } },
        { label: 'Change Language', action: switchLocaleBasedOnActive, icon: 'fa-solid fa-language' },
    ]);
</script>
