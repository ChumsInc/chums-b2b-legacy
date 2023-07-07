import React from 'react';
import {Link} from 'react-router-dom';
import ProductImage from "./ProductImage";
import classNames from 'classnames';
import SeasonTeaser from "./SeasonTeaser";

const ProductLink = ({title, description, product, imageUrl, className=''}) => {
    const link = !!product.defaultCategoryKeyword
        ? `/products/${product.defaultCategoryKeyword}/${product.keyword}`
        : `/products/${product.keyword}`;
    const selfClassName = {
        'col-sm-3 col-6': /col/i.test(className) === false,
    };

    return (
        <div className={classNames(className, selfClassName)}>
            <Link className="category" to={link}>
                <ProductImage image={imageUrl || product.image} colorCode={product.defaultColor} title={title} altText={title}
                              size="400" className="main-image"/>
                <div className="product-title">{title}</div>
                <SeasonTeaser season_teaser={product.season_teaser} season_active={product.season_active} />
            </Link>
            <div className="description">
                <div dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </div>
    )
};

export default ProductLink;
