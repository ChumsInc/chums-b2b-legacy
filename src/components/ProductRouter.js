import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router';
import PropTypes from 'prop-types';
import {fetchKeywords} from '../actions/products';
import ProgressBar from "./ProgressBar";
import Alert from "../common-components/Alert";
import CategoryPage2 from "./CategoryPage";
import ProductPage from "./ProductPage";
import {PATH_PRODUCT} from "../constants/paths";
import {buildPath} from "../utils/fetch";
import ErrorBoundary from "../common-components/ErrorBoundary";
import ContentPage404 from "./ContentPage404";

class ProductRouter extends Component {

    static propTypes = {
        keywords: PropTypes.array,
        keywordsLoading: PropTypes.bool,
        fetchKeywords: PropTypes.func.isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                category: PropTypes.string,
                product: PropTypes.string,
            }),
            path: PropTypes.string,
            url: PropTypes.string,
        })
    };

    static defaultProps = {
        keywords: [],
        keywordsLoading: false,
    };

    componentDidMount() {
        if (this.props.keywords.length === 0) {
            this.props.fetchKeywords();
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }


    render() {
        const {keywords, keywordsLoading, match} = this.props;
        const {category, product} = match.params;
        let keyword;

        if (!!category && !product) {
            const [kw] = keywords.filter(kw => kw.keyword === category);
            keyword = {...kw};
        } else if (!!product) {
            const [kw] = keywords.filter(kw => kw.keyword === product);
            keyword = {...kw};
        }

        if (keyword && keyword.redirect_to_parent > 0) {
            const [kw] = keywords.filter(kw => kw.pagetype === 'product').filter(kw => kw.id === keyword.redirect_to_parent);
            if (kw) {
                const pathname = buildPath(PATH_PRODUCT, {
                    category: (kw.parent ? kw.parent : kw.keyword),
                    product: (kw.parent ? kw.keyword : undefined)
                });
                const state = {variant: keyword.keyword};
                console.log('redirect to: ', {pathname, state});
                // this.props.history.replace(path, [{variant: keyword.keyword}])
                return (<Redirect to={{pathname, state}} />);
            }
        }

        return (
            <div className="product-page">
                {!!keywordsLoading && <ProgressBar label="Loading Keywords" />}
                {!keyword.pagetype && <ContentPage404 />}
                {keyword.pagetype === 'category' && <CategoryPage2 keyword={keyword.keyword}/>}
                {keyword.pagetype === 'product' && (
                    <ErrorBoundary>
                        <ProductPage keyword={keyword.keyword}/>
                    </ErrorBoundary>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({products, user}) => {
    const {keywords, keywordsLoading} = products;
    return {
        keywords: keywords.filter(kw => !!kw.status),
        keywordsLoading
    };
};

const mapDispatchToProps = {
    fetchKeywords
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductRouter));
