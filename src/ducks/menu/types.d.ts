import {MenuItem} from "b2b-types";

export interface MenuState {
    productMenu: Menu|null;
    items: MenuItem[]
    loading: boolean;
    loaded: boolean;
    isOpen: boolean;
}
