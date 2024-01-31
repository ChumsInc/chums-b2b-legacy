import React from 'react';
import {Link as RoutedLink} from 'react-router-dom';
import ProductImage from "../../../components/ProductImage";
import classNames from 'classnames';
import SeasonTeaser from "../../../components/SeasonTeaser";
import {BasicProduct} from "b2b-types";
import CategoryGridItem from "./CategoryGridItem";
import Link from "@mui/material/Link";

const ProductLink = ({title, description, product, imageUrl, className=''}:{
    title: string;
    description: string;
    product: BasicProduct;
    imageUrl: string;
    className?: string;
}) => {
    const link = !!product.defaultCategoryKeyword
        ? `/products/${product.defaultCategoryKeyword}/${product.keyword}`
        : `/products/${product.keyword}`;
    const selfClassName = {
        'col-sm-3 col-6': !/col/i.test(className),
    };

    return (
        <CategoryGridItem className={classNames(className, selfClassName)}>
            <Link component={RoutedLink} to={link} underline="hover">
                <ProductImage image={imageUrl || product.image} colorCode={product.defaultColor} title={title} altText={title}
                              size="400" className="main-image"/>
                <div className="product-title">{title}</div>
                <SeasonTeaser season_teaser={product.season_teaser} season_active={product.season_active} />
            </Link>
            <div className="description">
                <div dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </CategoryGridItem>
    )
};

export default ProductLink;
