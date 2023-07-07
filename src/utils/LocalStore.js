/**
 * Created by steve on 5/18/2017.
 */


export default class LocalStore {
    static getItem(key) {
        if (!window.localStorage) {
            return null;
        }
        const data = window.localStorage.getItem(key);
        try {
            return JSON.parse(data);
        } catch(err) {
            console.log("getItem()", key, err.message);
            return data ?? null;
        }
    }

    static setItem(key, data) {
        if (!window.localStorage) {
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key) {
        if (!window.localStorage) {
            return;
        }
        window.localStorage.removeItem(key);
    }

}
