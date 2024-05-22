/**
 * Created by steve on 8/24/2016.
 */
import {auth} from "./IntranetAuthService";
import B2BError from "../types/generic";
import localStore from "../utils/LocalStore";
import {STORE_VERSION} from "../constants/stores";
import 'isomorphic-fetch';

function getCredentials():string|null {
    const token = auth.getToken();
    if (token) {
        return `Bearer ${token}`;
    }
    return null
}

async function handleJSONResponse<T = any>(res:Response, args?: any):Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        await postErrors({message: `error: ${res.status}`, componentStack: res.url})
        return Promise.reject(new B2BError(text, res.url, null, res.status));
    }
    const json = await res.json();
    if (json.error) {
        const componentStack = JSON.stringify({
            url: res.url,
            args: args ?? null
        })
        await postErrors({message: json.error, componentStack: res.url});
        console.warn(json.error);
        return Promise.reject(new B2BError(json.error, res.url));
    }
    return json || {};
}

export async function allowErrorResponseHandler<T = any>(res:Response):Promise<T> {
    try {
        return await res.json() as T;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("allowErrorResponseHandler()", err.message);
            return Promise.reject(err);
        }
        console.debug("allowErrorResponseHandler()", err);
        return Promise.reject(new Error('Error in allowErrorResponseHandler()'));
    }
}

export interface FetchJSONOptions extends RequestInit {
    responseHandler?: <T = any>(res:Response) => Promise<T>;
}

export async function fetchJSON<T = any>(url:string, options:FetchJSONOptions = {}):Promise<T> {
    try {
        const {responseHandler, ..._options} = options;
        _options.headers = new Headers(_options?.headers);
        if (!_options.credentials || _options.credentials === 'same-origin') {
            const credentials = getCredentials();
            if (credentials) {
                _options.headers.append('Authorization', credentials);
                options.credentials = 'omit';
            }
        }
        if (!!_options?.method && ['POST', 'PUT'].includes(_options.method.toUpperCase())) {
            _options.headers.append('Accept', 'application/json')
            _options.headers.append('Content-Type', 'application/json')
        }
        const res = await fetch(url, {..._options});
        if (typeof responseHandler !== 'undefined') {
            return responseHandler(res);
        }
        return await handleJSONResponse<T>(res, options.body);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("fetchJSON()", err.message);
            return Promise.reject(err);
        }
        console.error("fetchJSON()", err);
        if (typeof err === 'string') {
            return Promise.reject(new Error(err));
        }
        return Promise.reject(err);
    }
}

export async function fetchHTML(url:string, options: RequestInit = {}):Promise<string|undefined> {
    try {
        options.headers = new Headers(options?.headers);
        const credentials = getCredentials();
        if (credentials) {
            options.headers.append('Authorization', credentials)
        }
        const res = await fetch(url, {...options});
        if (!res.ok) {
            const text = await res.text();
            return Promise.reject(new Error(text));
        }
        return await res.text();
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("fetchHTML()", err.message);
            return Promise.reject(err);
        }
        console.error("fetchHTML()", err)
        if (typeof err === 'string') {
            return Promise.reject(new Error(err));
        }
        return Promise.reject(err);
    }
}

export interface PostErrorsArg {
    message: string;
    componentStack?: string;
    userId?: number;
}

export async function postErrors({message, componentStack, userId}:PostErrorsArg): Promise<void> {
    try {
        const version = localStore.getItem(STORE_VERSION, '-');
        const body = JSON.stringify({
            url: global.window.location.pathname,
            message,
            componentStack: componentStack ?? '',
            user_id: userId ?? 0,
            version,
        });
        await fetchJSON('/api/error-reporting', {method: 'POST', body, responseHandler: allowErrorResponseHandler});
    } catch (err) {}
}
