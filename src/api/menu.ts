import {Menu} from "b2b-types";
import {fetchJSON} from "./fetch";

// generally loaded in Preloaded State, here in case we need to refresh.
export async function fetchProductMenu():Promise<Menu|null> {
    try {
        const {menus} = await fetchJSON<{menus: Menu[]}>('/api/menus/2');
        return menus[0] || null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadProductMenu()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadProductMenu()", err);
        return Promise.reject(new Error('Error in loadProductMenu()'));
    }
}

export async function fetchMenu(id:number):Promise<Menu|null> {
    try {
        if (!id) {
            return null;
        }

        const response = await fetchJSON<{menus?: Menu[]}>(`/api/menus/${encodeURIComponent(id)}`);
        return response?.menus?.[0] ?? null;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("loadMenu()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadMenu()", err);
        return Promise.reject(new Error('Error in loadMenu()'));
    }
}
