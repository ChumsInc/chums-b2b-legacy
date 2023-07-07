import React, {Fragment} from 'react';
import CategoryLink from "./CategoryLink";
import ProductLink from "./ProductLink";
import ProductImage from "./ProductImage";
import {Link} from "react-router-dom";
import CategorySection from "./CategorySection";


export const ITEM_TYPES = {
    product: 'product',
    category: 'category',
    section: 'section',
    link: 'link',
    other: '',
};

const CategoryPageElement = ({itemType = '', title = '', description = '', category = {}, product = {}, ...rest}) => {
    switch (itemType) {
    case ITEM_TYPES.category:
        return (<CategoryLink title={title} description={description} keyword={category.keyword} {...rest} />);
    case ITEM_TYPES.product:
        return (<ProductLink title={title} description={description} product={product} {...rest}/>);
    case ITEM_TYPES.section:
        return (<CategorySection title={title} description={description} {...rest} />);
    case ITEM_TYPES.link:
        return (
            <div className={"col-sm-3 col-6 " + (rest.className || '')}>
                {rest.urlOverride && (
                    <>
                        <Link className="link" to={rest.urlOverride}>
                            {!!rest.imageUrl && (
                                <ProductImage image={rest.imageUrl} title={title} altText={title} size="400"
                                              className="main-image"/>
                            )}
                            <div className="product-title">{title}</div>
                        </Link>
                        <div className="description">
                            <div dangerouslySetInnerHTML={{__html: description}}/>
                        </div>
                    </>
                )}
                {!rest.urlOverride && (
                    <div>
                        {!!rest.imageUrl && (
                            <ProductImage image={rest.imageUrl} title={title} altText={title} size="400"
                                          className="main-image"/>
                        )}
                        <div className="product-title">{title}</div>
                        <div className="description">
                            <div dangerouslySetInnerHTML={{__html: description}}/>
                        </div>

                    </div>
                )}
            </div>
        );
    default:
        return (
            <Fragment>
                <h2>{title}</h2>
                <div>{description}</div>
            </Fragment>

        )
    }
};

export default CategoryPageElement;
