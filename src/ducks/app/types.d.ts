import {Keyword, Menu, SearchResult, Slide} from "b2b-types";

export interface AppState {
    productMenu: Menu|null;
    showNavBar: boolean;
    subNav: string;
    rowsPerPage: number;
    customerTab: number;
    documentTitle: string;
    keywords: Keyword[],
    lifestyle: string;
    debug: boolean|null;
}
