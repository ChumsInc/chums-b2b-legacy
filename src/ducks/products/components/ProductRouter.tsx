import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router';
import {fetchKeywords} from '../../../actions/products';
import ProgressBar from "../../../components/ProgressBar";
import AppAlert from "../../../common-components/AppAlert";
import CategoryPage2 from "../../category/components/CategoryPage";
import ProductPage from "./ProductPage";
import {PATH_PRODUCT} from "../../../constants/paths";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {selectProductKeywords, selectProductKeywordsLoading} from "../selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {Keyword} from "b2b-types";
import Box from "@mui/material/Box";

const ProductRouter = () => {
    const dispatch = useAppDispatch();
    const keywords = useSelector(selectProductKeywords);
    const keywordsLoading = useSelector(selectProductKeywordsLoading);
    const {category, product} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!keywords.length && !keywordsLoading) {
            dispatch(fetchKeywords());
        }
    }, []);

    let keyword: Keyword | null = null;

    if (!!category && !product) {
        const [kw] = keywords.filter(kw => kw.keyword === category);
        keyword = {...kw};
    } else if (!!product) {
        const [kw] = keywords.filter(kw => kw.keyword === product);
        keyword = {...kw};
    }

    if (keyword && keyword.redirect_to_parent > 0) {
        const [kw] = keywords.filter(kw => kw.pagetype === 'product').filter(kw => kw.id === keyword?.redirect_to_parent);
        if (kw) {
            let pathname = PATH_PRODUCT
                .replace(':category', encodeURIComponent(kw.parent ? kw.parent : kw.keyword))
                .replace(':product?', encodeURIComponent(kw.parent ? kw.keyword : ''));
            const state = {variant: keyword.keyword};
            console.log('redirect to: ', {pathname, state});
            // this.props.history.replace(path, [{variant: keyword.keyword}])
            navigate(pathname, {state})
            return;
        }
    }

    return (
        <ErrorBoundary>
            <Box>
                {keywordsLoading && <ProgressBar label="Loading Keywords"/>}
                {!keyword?.pagetype && <AppAlert message={"Product not found!"}/>}
                {keyword?.pagetype === 'category' && <CategoryPage2 keyword={keyword.keyword}/>}
                {keyword?.pagetype === 'product' && (<ProductPage keyword={keyword.keyword}/>)}
            </Box>
        </ErrorBoundary>
    );
}

export default ProductRouter;
