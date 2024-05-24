/**
 * Created by steve on 5/18/2017.
 */
import {deprecatedStorageKeys} from "../constants/stores";

export default class LocalStore {
    static getItem<T = any>(key:string, defaultValue:T):T {
        if (typeof window === 'undefined' || !window.localStorage) {
            return defaultValue;
        }
        const data = window.localStorage.getItem(key);
        if (!data) {
            return defaultValue;
        }
        try {
            return JSON.parse(data) ?? defaultValue;
        } catch(err:unknown) {
            return defaultValue;
        }
    }

    static setItem<T>(key:string, data:any) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key:string) {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        window.localStorage.removeItem(key);
    }

    static removeDeprecatedItems() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        Object.keys(deprecatedStorageKeys).forEach(key => {
            const newKey = deprecatedStorageKeys[key];
            const item = LocalStore.getItem(key, null);
            if (!!item && !!newKey) {
                LocalStore.setItem(newKey, item);
            }
            LocalStore.removeItem(key);
        });
    }

}
