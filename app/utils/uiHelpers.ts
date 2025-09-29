export type ColumnWidthOptions = 'full' | 'half' | 'third' | 'quarter' | 'two-thirds' | 'three-quarters' | 'auto'

export const getColumnWidthClass = (width: ColumnWidthOptions): string => {
    const colWidthMapping = {
        full: 'lg:col-span-12',
        half: 'lg:col-span-6 sm:col-span-12',
        third: 'lg:col-span-4 sm:col-span-6',
        quarter: 'lg:col-span-3 sm:col-span-6',
        'two-thirds': 'col-span-8',
        'three-quarters': 'col-span-9',
        auto: 'col-span-auto',
    };
    return colWidthMapping[width] || colWidthMapping['auto'];
}
