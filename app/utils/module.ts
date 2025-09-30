import type { CellContext } from "@tanstack/vue-table";
import CompaniesForm from "~/forms/CompaniesForm.vue";
import DoorsForm from "~/forms/DoorsForm.vue";
import UsersForm from "~/forms/UsersForm.vue";

/**
 * IMPORTANT
 * 
 * List of modules with their display names, icon names, and any special column definitions.
 * Add new modules here as needed.
 */
const moduleList: Module[] = [
    { name: 'users', iconName: 'fa fa-user', formComponent: UsersForm,
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
    { name: 'example', iconName: 'fa-solid fa-cube' }
];

interface Module {
    name: string;
    iconName: string;
    formComponent?: any; // Vue component for the form, if applicable
    specialColumnDefs?: {
        [columnName: string]: (props: CellContext<unknown, unknown>) => unknown;
    };
}

export function getAllModules(): Module[] {
    return moduleList;
}

export function getModuleInfo(moduleName: string): Module | undefined {
    return moduleList.find(m => m.name === moduleName);
}

export const getModuleDisplayName = (moduleName: string): string => {
    const { t } = useI18n();
    const module = getModuleInfo(moduleName);
    return module ? t(module.name) : moduleName;
}

export const useModuleDisplayName = (moduleName: Ref<string>) => {
    const { t } = useI18n();
    return computed(() => {
        const module = getModuleInfo(moduleName.value);
        return module ? t(module.name) : moduleName.value;
    });
}

export const getModuleFormComponent = (moduleName: string): any => {
    const module = getModuleInfo(moduleName);
    return module ? module.formComponent : null;
}

