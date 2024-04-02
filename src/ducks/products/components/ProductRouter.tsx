import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router';
import ProgressBar from "../../../components/ProgressBar";
import CategoryPage2 from "../../category/components/CategoryPage";
import ProductPage from "./ProductPage";
import {PATH_PRODUCT} from "../../../constants/paths";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {useAppDispatch} from "../../../app/configureStore";
import {Keyword} from "b2b-types";
import Box from "@mui/material/Box";
import {loadKeywords} from "../../keywords/actions";
import {selectKeywordsList, selectKeywordsLoading} from "../../keywords/selectors";

const ProductRouter = () => {
    const dispatch = useAppDispatch();
    const keywords = useSelector(selectKeywordsList);
    const keywordsLoading = useSelector(selectKeywordsLoading);
    const {category, product} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!keywords.length && !keywordsLoading) {
            dispatch(loadKeywords());
        }
    }, []);

    let keyword: Keyword | null = null;

    if (!!category && !product) {
        const [kw] = keywords.filter(kw => kw.keyword === category);
        if (kw) {
            keyword = {...kw};
        }
    } else if (!!product) {
        const [kw] = keywords.filter(kw => kw.keyword === product);
        if (kw) {
            keyword = {...kw};
        }
    }

    if (!keyword) {
        navigate('/products/all', {replace: true});
        return;
    }

    if (keyword.redirect_to_parent > 0) {
        const [kw] = keywords.filter(kw => kw.pagetype === 'product').filter(kw => kw.id === keyword.redirect_to_parent);
        if (kw) {
            let pathname = PATH_PRODUCT
                .replace(':category', encodeURIComponent(kw.parent ? kw.parent : kw.keyword))
                .replace(':product?', encodeURIComponent(kw.parent ? kw.keyword : ''));
            const state = {variant: keyword.keyword};
            console.log('redirect to: ', {pathname, state});
            // this.props.history.replace(path, [{variant: keyword.keyword}])
            navigate(pathname, {state, replace: true})
            return;
        }
    }

    return (
        <ErrorBoundary>
            <Box>
                {keywordsLoading && <ProgressBar label="Loading Keywords"/>}
                {keyword.pagetype === 'category' && <CategoryPage2 keyword={keyword.keyword}/>}
                {keyword.pagetype === 'product' && (<ProductPage keyword={keyword.keyword}/>)}
            </Box>
        </ErrorBoundary>
    );
}

export default ProductRouter;
