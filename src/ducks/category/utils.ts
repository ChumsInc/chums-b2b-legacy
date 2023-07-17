import {Keyword} from "b2b-types";

export const categoryKeywordSorter = (a: Keyword, b: Keyword) => a.keyword.toLowerCase() > b.keyword.toLowerCase() ? 1 : -1;
