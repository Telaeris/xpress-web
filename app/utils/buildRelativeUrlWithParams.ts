import qs from 'qs';

export function buildRelativeUrlWithParams(baseUrl: string, params: Object = {}): string {
    const queryString = qs.stringify(params);
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
