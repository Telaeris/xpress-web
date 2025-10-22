import type { CellContext } from "@tanstack/vue-table";
import modulesConfig from "../../config/modules.config";

interface Module {
    name: string;
    iconName: string;
    formComponent?: any; // Vue component for the form, if applicable
    specialColumnDefs?: {
        [columnName: string]: (props: CellContext<unknown, unknown>) => unknown;
    };
}

export function getAllModules(): Module[] {
    return modulesConfig;
}

export const getModuleInfo = (moduleName: string): Module | undefined => {
    return modulesConfig.find(m => m.name === moduleName);
}

export const getModuleIconName = (moduleName: string): string => {
    const module = getModuleInfo(moduleName);
    return module ? module.iconName : "";
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

