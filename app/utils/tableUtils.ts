import type { CellContext, Row, SortingState } from "@tanstack/vue-table";

interface TableResponse {
    columns: ColumnResponse[];
    data: Array<Array<any>> | Array<{
        [key: string]: any
    }>;
    defaultOrder: DefaultOrderResponse | SortingState;
    recordsTotal: number,
    recordsFiltered: number,
}
interface DefaultOrderResponse {
    order_column: string;
    order_dir: 'asc' | 'desc';
    original_index: any;
}

interface ColumnResponse {
    class_name: string;
    column_name: string;
    is_display: boolean;
    is_linkable: boolean;
    sort: boolean;
    title: string;
}

export const getTableData = async (moduleName: string, params: Object = {}) => {
    const url: string = buildRelativeUrlWithParams(`${moduleName}/lists`, params);
    const response = await apiFetch<TableResponse>(url);
    response.data = buildDataFromResponse(response.data as Array<Array<any>>, response.columns);
    response.defaultOrder = convertResponseOrder(response.defaultOrder as DefaultOrderResponse);
    return response;
}

const convertResponseOrder = (order: DefaultOrderResponse): SortingState => {
    return [{
        desc: order.order_dir === 'desc',
        id: order.order_column,
    }];
} 

export const buildColumnsFromResponse = (response: ColumnResponse[], moduleName: string): Object[] => {
    let out: Object[] = [];
    response.forEach((col: ColumnResponse) => {
        out.push({
            accessorKey: col.column_name,
            header: col.title, 
            enableSorting: !col.sort,
            cell: (props: CellContext<any, any>) => {
                if (col.is_linkable) {
                    return h('a', {
                        href: `#`,
                        class: 'text-primary-hover hover:underline',
                        onClick: (e: Event) => {
                            e.preventDefault();
                            goToFormFromRow(props.row, moduleName);
                        }
                    }, props.getValue());
                } else if (getModuleInfo(moduleName)?.specialColumnDefs?.[col.column_name]) {
                    return getModuleInfo(moduleName)?.specialColumnDefs?.[col.column_name]?.(props);
                } else {
                    return props.getValue();
                }
            },
            meta: {
                displayed: col.is_display,
            },

        });
    });
    return out;
}

export const buildDataFromResponse = (responseData: Array<Array<any>>, columns: ColumnResponse[]): Object[] => {
    let out: Object[] = [];
    responseData.forEach((row: Array<any>) => {
        let obj: any = {};
        columns.forEach((col: ColumnResponse, index: number) => {
            obj[col.column_name] = row[index];
        });
        out.push(obj);
    });
    return out;
}

export const goToFormFromRow = (row: Row<any>, moduleName: string) => {
    const id = row.original.id;
    if (id) {
        loadModuleFormWithData(moduleName, id);
    }
}

let canLoadMore = true;
export const tableScrolledListener = (onScroll: () => void) => {
    return (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
            if (canLoadMore) {
                canLoadMore = false;
                onScroll();
                setTimeout(() => {
                    canLoadMore = true;
                }, 1000);
            }
        }
    }
}
