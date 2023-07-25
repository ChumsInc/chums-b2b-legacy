import {Keyword} from "b2b-types";

export const keywordsSorter = (a:Keyword, b:Keyword) => {
    return a.keyword.toLowerCase() > b.keyword.toLowerCase() ? 1 : -1;
}

export const pageKeywordsFilter = (kw:Keyword) => kw.pagetype === 'page';

