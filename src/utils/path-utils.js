import {compile} from "path-to-regexp";


const compiledPaths = {};


export function cacheBuster(url) {
    const value = new Date().valueOf().toString(36);
    if (url) {
        const re = /\b(_=[0-9a-z]+)\b/gi;
        if (re.test(url)) {
            return url.replace(/\b(_=[0-9a-z]+)\b/, `_=${value}`);
        }
        return url + (/\?/.test(url) ? '&' : '?') + `_=${value}`;
    }
    return value;
}


export const buildPath = (path, props) => {
    try {
        let query;
        let compiledQuery;
        if (Array.isArray(path)) {
            [path, query] = path;
        }
        if (!compiledPaths[path]) {
            compiledPaths[path] = compile(path);
        }
        const toPath = compile(path, {encode: encodeURIComponent});
        const pathname = toPath({...props});
        if (!!query) {
            const toQuery = compile(query, {encode: encodeURIComponent});
            compiledQuery = toQuery({...props});
        }
        return !!compiledQuery ? [pathname, compiledQuery].join('?') : pathname;
    } catch (e) {
        console.log('buildPath()', e.message, path, props);
        return path;
    }
};
