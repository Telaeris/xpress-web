import CompaniesForm from "~/forms/CompaniesForm.vue";
import DoorsForm from "~/forms/DoorsForm.vue";
import UsersForm from "~/forms/UsersForm.vue";
import type { CellContext } from "@tanstack/vue-table";


interface ModuleConfig {
    name: string
    iconName: string
    formComponent?: any, // TODO: make this non-optional when all forms defined
    specialColumnDefs?: { // TODO: move this to a different config
        [columnName: string]: (props: CellContext<unknown, unknown>) => unknown;
    }
};

const moduleList: ModuleConfig[] = [
    {name: 'users', iconName: 'fa fa-user', formComponent: UsersForm,
        specialColumnDefs: {
            photo: (props: CellContext<unknown, unknown>) => {
                return h('img', {
                    src: props.getValue() as string,
                    alt: 'User Photo',
                    class: 'size-10 rounded-full object-cover'
                });
            }
        }
    },
    { name: 'companies', iconName: 'fa-solid fa-building', formComponent: CompaniesForm },
    { name: 'zones', iconName: 'fa-solid fa-map' },
    { name: 'doors', iconName: 'fa-solid fa-door-closed', formComponent: DoorsForm },
    { name: 'readers', iconName: 'fa-solid fa-id-card' },
    { name: 'entry_exit', iconName: 'fa-solid fa-door-open' },
    { name: 'example', iconName: 'fa-solid fa-cube' },
    { name: 'roles', iconName: 'fa-solid fa-user-shield' },
    { name: 'holidays', iconName: 'fa-solid fa-calendar-day' },
    { name: 'time_zones', iconName: 'fa-solid fa-clock' },
    { name: 'muster_sites', iconName: 'fa-solid fa-people-roof' },
    { name: 'badge_layouts', iconName: 'fa-solid fa-id-badge' },
    { name: 'groups', iconName: 'fa-solid fa-layer-group' },
    { name: 'activity_history', iconName: 'fa-solid fa-history' },
    { name: 'events', iconName: 'fa-solid fa-bell' },
    { name: 'muster', iconName: 'fa-solid fa-people-arrows' },
    { name: 'muster_reports', iconName: 'fa-solid fa-chart-column' },
    { name: 'muster_dashboard', iconName: 'fa-solid fa-chart-pie' },
    { name: 'time_cards', iconName: 'fa-solid fa-clock-rotate-left' },
    { name: 'check_out_in', iconName: 'fa-solid fa-sign-in-alt' },
    { name: 'inspections', iconName: 'fa-solid fa-clipboard-check' },
    { name: 'inventory_items', iconName: 'fa-solid fa-toolbox' },
    { name: 'catalog_items', iconName: 'fa-solid fa-boxes' },
    { name: 'jobs', iconName: 'fa-solid fa-briefcase' },
    { name: 'departments', iconName: 'fa-solid fa-sitemap' },
    { name: 'categories', iconName: 'fa-solid fa-tags' },
    { name: 'defects', iconName: 'fa-solid fa-exclamation-triangle' },
    { name: 'items', iconName: 'fa-solid fa-cube' },
    { name: 'item_status', iconName: 'fa-solid fa-clipboard-list' },
    { name: 'item_activity', iconName: 'fa-solid fa-history'},
    { name: 'receive_inventory', iconName: 'fa-solid fa-truck-loading' },
    { name: 'maps', iconName: 'fa-solid fa-map-location' },
    { name: 'reader_profiles', iconName: 'fa-solid fa-id-badge' },
    { name: 'tracking_groups', iconName: 'fa-solid fa-object-group' },
    { name: 'tracking_group_types', iconName: 'fa-solid fa-th-list' },
    { name: 'rfid_readers', iconName: 'fa-solid fa-tower-cell' },
    { name: 'rfid_rules', iconName: 'fa-solid fa-shield-alt' },
    { name: 'sensors', iconName: 'fa-solid fa-microchip' },
    { name: 'sensor_hubs', iconName: 'fa-solid fa-server' },
    { name: 'manufacturer_sensor_types', iconName: 'fa-solid fa-industry' },
    { name: 'measurement_units', iconName: 'fa-solid fa-ruler' },
    { name: 'sensor_alerts', iconName: 'fa-solid fa-bullhorn' },
    { name: 'devices', iconName: 'fa-solid fa-tablet-alt' },
    { name: 'incidents', iconName: 'fa-solid fa-exclamation-circle' },
    { name: 'incident_dashboard', iconName: 'fa-solid fa-chart-line' },
    { name: 'reports', iconName: 'fa-solid fa-file-alt' },
    { name: 'user_profiles', iconName: 'fa-solid fa-user-cog' },
    { name: 'user_logins', iconName: 'fa-solid fa-sign-in-alt' },
    { name: 'notifications', iconName: 'fa-solid fa-bell' },
    { name: 'lost_issued_items', iconName: 'fa-solid fa-box-open' },
    { name: 'my_downloads', iconName: 'fa-solid fa-download' },
    { name: 'map_views', iconName: 'fa-solid fa-map-marked-alt' },
    { name: 'mapping_dashboards', iconName: 'fa-solid fa-chart-area' },
    { name: 'guard_tours', iconName: 'fa-solid fa-shield-alt' },
    { name: 'checkpoints', iconName: 'fa-solid fa-map-pin' },
];

export default moduleList;
