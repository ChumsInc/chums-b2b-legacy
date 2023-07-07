import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {loadCategory} from '../ducks/category/actions';
import CategoryPageElement from "./CategoryPageElement";
import DocumentTitle from "./DocumentTitle";
import {useAppDispatch} from "../app/configureStore";
import {selectCategory, selectCategoryLoading} from "../ducks/category/selectors";
import LinearProgress from "@mui/material/LinearProgress";
import classNames from "classnames";

/**
 *
 * @param {string} keyword
 * @return {JSX.Element}
 * @constructor
 */
const CategoryPage = ({keyword}) => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectCategoryLoading);
    const category = useSelector(selectCategory);

    useEffect(() => {
        dispatch(loadCategory(keyword));
    }, [keyword]);

    if (!category) {
        return (
            <div className="category-panel">
                {loading && <LinearProgress variant="indeterminate"/>}
            </div>
        )
    }

    const {title, lifestyle, pageText} = category;
    const children = category.children.filter(cat => !!cat.status).sort((a,b) => a.priority - b.priority);
    return (
        <div className="category-panel">
            <DocumentTitle documentTitle={title}/>
            <h2>{title}</h2>
            {loading && <LinearProgress variant="indeterminate"/>}
            {!!pageText && <div dangerouslySetInnerHTML={{__html: pageText}}/>}
            <div className={classNames("row g-1", {'justify-content-lg-center': children.length < 4})}>
                {children
                    .filter(child => !!child.status)
                    .sort((a, b) => a.priority - b.priority)
                    .map(child => (
                        <CategoryPageElement key={child.id}
                                             itemType={child.itemType}
                                             title={child.sectionTitle || child.title}
                                             description={child.sectionDescription || child.description}
                                             imageUrl={child.imageUrl}
                                             category={child.category}
                                             product={child.product}
                                             className={child.className}/>
                    ))}
            </div>
        </div>
    )
}

export default CategoryPage;
