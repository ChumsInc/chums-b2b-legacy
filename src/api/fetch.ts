/**
 * Created by steve on 8/24/2016.
 */
import {auth} from "./IntranetAuthService";
import B2BError from "@/types/generic";

function getCredentials():string|null {
    const token = auth.getToken();
    if (token) {
        return `Bearer ${token}`;
    }
    return null
}


async function handleJSONResponse<T = any>(res:Response):Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        return Promise.reject(new B2BError(text, res.url, null, res.status));
    }
    const json = await res.json();
    if (json.error) {
        console.warn(json.error);
        return Promise.reject(new B2BError(json.error, res.url));
    }
    return json || {};
}

export async function fetchJSON<T = any>(url:string, options:RequestInit = {}, skipCredentials:boolean = false):Promise<T> {
    try {
        options.headers = new Headers(options?.headers);
        if (!skipCredentials) {
            const credentials = getCredentials();
            if (credentials) {
                options.headers.append('Authorization', credentials)
            }
        }
        if (!!options?.method && ['POST', 'PUT'].includes(options.method.toUpperCase())) {
            options.headers.append('Accept', 'application/json')
            options.headers.append('Content-Type', 'application/json')
        }
        const res = await fetch(url, {credentials: 'same-origin', ...options});
        return await handleJSONResponse<T>(res);
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
        const res = await fetch(url, {credentials: 'same-origin', ...options});
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
