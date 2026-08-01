const STORAGE_HOSTS = [
    'http://storage:9000',
    'https://storage:9000',
    'http://localhost:9000',
    'https://localhost:9000',
    'storage:9000',
];

export function normalizeMediaUrl(url) {
    if (!url || typeof url !== 'string') return url;

    for (const host of STORAGE_HOSTS) {
        if (url.startsWith(host)) {
            return url.slice(host.length) || '/social-media/';
        }
    }

    return url;
}

export const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';

export const DEFAULT_IMAGE_ERROR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%232d2d2d%22/%3E%3Ctext x=%22100%22 y=%2295%22 text-anchor=%22middle%22 font-size=%2214%22 fill=%22%23999%22%3E%D0%9E%D1%88%D0%B8%D0%B1%D0%BA%D0%B0%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8%3C/text%3E%3Ctext x=%22100%22 y=%22115%22 text-anchor=%22middle%22 font-size=%2214%22 fill=%22%23999%22%3E%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%3C/text%3E%3C/svg%3E';

export const DEFAULT_IMAGE_ERROR_LARGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22%3E%3Crect width=%22600%22 height=%22400%22 fill=%22%232d2d2d%22/%3E%3Ctext x=%22300%22 y=%22195%22 text-anchor=%22middle%22 font-size=%2218%22 fill=%22%23999%22%3E%D0%9E%D1%88%D0%B8%D0%B1%D0%BA%D0%B0%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D1%81%D0%BA%D0%B8%20%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%3C/text%3E%3C/svg%3E';
