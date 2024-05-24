import {UnknownAction} from "@reduxjs/toolkit";
import {DeprecatedPageAction, isAsyncAction} from "../../types/actions";

export const isDeprecatedPageAction = (action: UnknownAction | DeprecatedPageAction): action is DeprecatedPageAction => {
    return isAsyncAction(action) && action.type === 'FETCH_PAGE';
}
