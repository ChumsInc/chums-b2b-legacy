import {Keyword} from "b2b-types";
import {DeprecatedKeywordsAction} from "../../types/actions";
import {UnknownAction} from "@reduxjs/toolkit";
import {FETCH_KEYWORDS} from "../../constants/actions";

export const keywordsSorter = (a: Keyword, b: Keyword) => {
    return a.keyword.toLowerCase() > b.keyword.toLowerCase() ? 1 : -1;
}

export const pageKeywordsFilter = (kw: Keyword) => kw.pagetype === 'page';

export const isDeprecatedKeywordsAction = (action: UnknownAction | DeprecatedKeywordsAction): action is DeprecatedKeywordsAction => {
    return !!action.status && action.type === 'FETCH_KEYWORDS';
}
