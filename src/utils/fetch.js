/**
 * Created by steve on 8/24/2016.
 */

import { auth } from './IntranetAuthService';
import 'isomorphic-fetch';
import {compile} from 'path-to-regexp';


fetch.credentials = 'include';

export default fetch;
export const Headers = fetch.Headers;
export const Request = fetch.Request;
export const Response = fetch.Response;
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_FAILED = 'ERR_NOT_AUTHENTICATED';

const compiledPaths = {};

function checkStatus(response) {
    return new Promise((resolve, reject) => {
        if ([401,403].includes(response.status)) {
            const err = new Error(`${response.status}: ${response.statusText}`);
            err.name = AUTH_ERROR;
            err.status = response.status;
            return reject(err);
        }
        if (response.status >= 200 && response.status < 500) {
            return resolve(response);
        }
        response.text()
            .then(res => {
                reject(new Error(`${response.status}: ${response.statusText}; ${res}`));
            })
            .catch(err => {
                console.log('checkStatus()', response, err.message);
                reject(new Error(`${response.status}: ${response.statusText};`));
            })
    });

}

const getAuthHeader = () => {
    const token = auth.getToken();
    return token ? {Authorization: `Bearer ${token}`} : {};
};

export const fetchOptions = {
    GET: (options = {}) => {
        const headers = options.headers || {};
        delete options.headers;
        return {
            credentials: 'same-origin',
            method: 'get',
            ...options,
            headers: {
                ...getAuthHeader(),
                ...headers,
            }
        }
    },
    PostJSON: (object) => {
        return {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(object)
        };
    },
    Delete: () => {
        return {
            credentials: 'same-origin',
            method: 'DELETE',
            ...getAuthHeader(),
        };
    }
};

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


export function fetchGET(url, options = {}) {
    return new Promise((resolve, reject) => {
        fetch(url, fetchOptions.GET(options))
            .then(response => checkStatus(response))
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    const err = new Error(response.error);
                    if (response.name) {
                        err.name = response.name;
                    }
                    if (response.debug) {
                        err.debug = response.debug;
                    }
                    console.log(response.name || '', response.error);
                    return reject(err);
                }
                resolve(response);
            })
            .catch(err => {
                if (err.message.toLowerCase() === 'failed to fetch') {
                    err.message = 'Failed to fetch; Perhaps your connection is down?';
                }
                console.log(err.message);
                reject(err);
            });
    });
}

export function fetchPOST(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, fetchOptions.PostJSON(data))
            .then(response => checkStatus(response))
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    const err = new Error(response.error);
                    if (response.name) {
                        err.name = response.name;
                    }
                    if (response.debug) {
                        err.debug = response.debug;
                    }
                    console.log(response.name || '', response.error);
                    return reject(err);
                }
                resolve(response);
            })
            .catch(err => {
                if (err.message.toLowerCase() === 'failed to fetch') {
                    err.message = 'Failed to fetch; Perhaps your connection is down?';
                }
                console.log(err.message);
                reject(err);
            });
    });
}

export function fetchDELETE(url) {
    return new Promise((resolve, reject) => {
        fetch(url, fetchOptions.Delete())
            .then(response => checkStatus(response))
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    const err = new Error(response.error);
                    if (response.name) {
                        err.name = response.name;
                    }
                    if (response.debug) {
                        err.debug = response.debug;
                    }
                    console.log(response.name || '', response.error);
                    return reject(err);
                }
                resolve(response);
            })
            .catch(err => {
                if (err.message.toLowerCase() === 'failed to fetch') {
                    err.message = 'Failed to fetch; Perhaps your connection is down?';
                }
                console.log(err);
                reject(err);
            });
    });
}
