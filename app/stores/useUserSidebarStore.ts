export interface UserSidebarMenuItem {
    name: string
    vis: boolean
    module: boolean
    kids: UserSidebarMenuItem[]
}

export const useUserSidebarStore = defineStore('userSidebar', {
    state: () => ({
        menuItems: [] as UserSidebarMenuItem[]
    }),
    getters: {
        getMenuItems(state): UserSidebarMenuItem[] {
            return state.menuItems;
        }
    },
    actions: {
        setMenuItems(items: UserSidebarMenuItem[], saveToServer = false) {
            let hasItems = this.menuItems.length > 0;
            console.log('Overriding sidebar menu items:', this.menuItems, 'with', items);
            this.menuItems = items;
            
            if (!hasItems || !saveToServer) return;
            formPost('/store_user_setting', {
                body: {
                    resources: items
                }
            }).then(() => {
                // Successfully stored user settings;
                toast().success('Sidebar Saved Successfully');
            });
        },

        clearMenuItems() {
            this.menuItems = [];
        }
    },
    persist: true
});
