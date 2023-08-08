/**
 * Created by steve on 5/18/2017.
 */


export default class LocalStore {
    static getItem<T = any>(key:string, defaultValue:T):T {
        if (!window.localStorage) {
            return defaultValue;
        }
        const data = window.localStorage.getItem(key);
        if (!data) {
            return defaultValue;
        }
        try {
            return JSON.parse(data) ?? defaultValue;
        } catch(err:unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                return defaultValue;
            }
            return defaultValue;
        }
    }

    static setItem<T>(key:string, data:any) {
        if (!window.localStorage) {
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key:string) {
        if (!window.localStorage) {
            return;
        }
        window.localStorage.removeItem(key);
    }

}
