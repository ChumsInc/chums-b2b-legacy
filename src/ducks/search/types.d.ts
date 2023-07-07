import {SearchResult} from "b2b-types";

export interface SearchState {
    term: string;
    results: SearchResult[];
    loading: boolean;
    show: boolean;
}
