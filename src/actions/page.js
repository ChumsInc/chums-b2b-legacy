import {FETCH_FAILURE, FETCH_INIT, FETCH_PAGE, FETCH_SUCCESS} from "../constants/actions";
import {buildPath, fetchGET} from "../utils/fetch";
import {API_PATH_PAGE} from "../constants/paths";
import {handleError, setAlert} from "./app";

export const fetchPage = (keyword) => (dispatch, getState) => {
    if (!keyword) {
        return;
    }
    const state = getState();
    const [page] = state.page.list.filter(kw => kw.pagetype === 'page' && kw.keyword === keyword);
    if (page) {
        dispatch({type: FETCH_PAGE, status: FETCH_SUCCESS, content: page});
    }
    dispatch ({type: FETCH_PAGE, status: FETCH_INIT});
    const url = buildPath(API_PATH_PAGE, {keyword});
    fetchGET(url, {cache: 'no-cache'})
        .then(({page}) => {
            if (!page) {
                dispatch({type: FETCH_PAGE, status: FETCH_FAILURE, page: {keyword, title: 'Page Not Found', status: 404}});
                return;
            }
            dispatch({type: FETCH_PAGE, status: FETCH_SUCCESS, page});
        })
        .catch(err => {
            dispatch({type: FETCH_PAGE, status: FETCH_FAILURE, page: {keyword}});
            dispatch(handleError(err, FETCH_PAGE));
        })
};
