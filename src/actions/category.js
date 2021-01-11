import {fetchGET, buildPath} from '../utils/fetch';
import {
    FETCH_CATEGORY, FETCH_FAILURE, FETCH_INIT, FETCH_ITEM_AVAILABILITY, FETCH_SUCCESS,
} from "../constants/actions";
import {handleError, setAlert} from "./app";
import {API_PATH_CATEGORY} from "../constants/paths";

export const fetchCategory = (keyword = '') => (dispatch, getState) => {
    if (keyword === '') {
        return;
    }
    if (cache[keyword] !== undefined) {
        dispatch({type: FETCH_CATEGORY, status: FETCH_SUCCESS, category: cache[keyword]});
    }
    dispatch({type: FETCH_CATEGORY, status: FETCH_INIT});
    const url = buildPath(API_PATH_CATEGORY, {keyword});

    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const [category] = res.categories;
            dispatch({type: FETCH_CATEGORY, status: FETCH_SUCCESS, category});
            cache[category.keyword] = category;
        })
        .catch(err => {
            dispatch({type: FETCH_CATEGORY, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_CATEGORY))
        })
};


const cache = {};
