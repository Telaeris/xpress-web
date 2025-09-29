import { format, formatDuration } from "date-fns";

export interface OccupancyRecord {
    badge_no: string;
    company_name: string;
    current_zone_timestamp: string;
    date_timestamp: number;
    id: number;
    image: string;
    latest_udf: any;
    reader_id: number;
    reader_name: string;
    user_full_name: string,
    zone_id: number;
    zone_name: string;
};

export const getTimeInZone = (record: OccupancyRecord): string => {
    // calculate the time spent in the zone
    const now = new Date();
    const entered = new Date(record.current_zone_timestamp);

    const seconds = Math.floor((now.getTime() - entered.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return formatDuration({
        seconds: seconds % 60,
        minutes: minutes % 60,
        hours: hours % 24,
        days: days,
    }, { delimiter: ', ' });
}

export const getEnteredZoneAt = (record: OccupancyRecord): string => {
    return format(new Date(record.current_zone_timestamp), 'yyyy/MM/dd HH:mm:ss');
}

export interface NestedZoneRecord {
    id: number;
    name: string;
    children: NestedZoneRecord[];
    cardholders?: number;
    start_doors?: {id: number; name: string}[];
    end_doors?: {id: number; name: string}[];
}

export interface EntryExitCardholderParams {
    limit: number;
    page: number;
    search: string;
    zone_id?: number;
}

export const fetchEntryExitCardholders = async (params: EntryExitCardholderParams): Promise<OccupancyRecord[]>=> {
    const url = buildRelativeUrlWithParams('/entry-exit-cardholders', params);
    const response = await apiFetch(url);
    return response.results.data as OccupancyRecord[];
}

export const allZonesName = "All Zones";

export const getTotalOccupancy = (record: NestedZoneRecord): number => {
    let total = 0;
    if (record.cardholders) {
        total += record.cardholders;
    }
    if (record.children && record.children.length > 0) {
        record.children.forEach(child => {
            total += getTotalOccupancy(child);
        });
    }
    return total;
};

