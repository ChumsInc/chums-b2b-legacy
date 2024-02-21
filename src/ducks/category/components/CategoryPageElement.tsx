import React, {Fragment} from 'react';
import CategoryLink from "./CategoryLink";
import ProductLink from "./ProductLink";
import ProductImage from "../../../components/ProductImage";
import {Link as RoutedLink} from "react-router-dom";
import {ProductCategoryChild} from "b2b-types";
import {
    isCategoryChildCategory,
    isCategoryChildLink,
    isCategoryChildProduct,
    isCategoryChildSection
} from "../../products/utils";
import Grid2 from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import CategoryGridItem from "./CategoryGridItem";
import ResponsiveProductImage from "../../../components/ResponsiveProductImage";
import Typography from "@mui/material/Typography";




export const ITEM_TYPES = {
    product: 'product',
    category: 'category',
    section: 'section',
    link: 'link',
    other: '',
};

const imageSizes = "(max-width: 600px) 168px, (max-width: 900px) 268px, 354px";
const CategoryPageElement = ({item}: {
    item: ProductCategoryChild;
}) => {
    if (isCategoryChildCategory(item)) {
        return (<CategoryLink title={item.title} description={item.description}
                              keyword={item.category.keyword} imageUrl={item.imageUrl} />);
    }
    if (isCategoryChildProduct(item)) {
        const {title, description, product, ...rest} = item;
        return (<ProductLink title={item.title} description={item.description}
                             product={item.product} imageUrl={item.imageUrl} />);
    }
    if (isCategoryChildLink(item) && item.urlOverride) {
        return (
            <CategoryGridItem className={item.className}>
                <Link component={RoutedLink} to={item.urlOverride}>
                    {!!item.imageUrl && (
                        <ResponsiveProductImage filename={item.imageUrl} alt={item.title} loading="lazy"
                                                sizes={imageSizes}
                                                width={400} height={400} />
                    )}
                    <div className="product-title">{item.title}</div>
                </Link>
                <div className="description">
                    <div dangerouslySetInnerHTML={{__html: item.description}}/>
                </div>
            </CategoryGridItem>
        );
    }
    if (isCategoryChildLink(item)) {
        return (
            <CategoryGridItem className={item.className}>
                {!!item.imageUrl && (
                    <ResponsiveProductImage filename={item.imageUrl} alt={item.title} loading="lazy"
                                            sizes={imageSizes}
                                            width={400} height={400} />
                )}
                <div className="product-title">{item.title}</div>
                <div className="description">
                    <div dangerouslySetInnerHTML={{__html: item.description}}/>
                </div>
            </CategoryGridItem>
        );
    }
    if (isCategoryChildSection(item)) {
        return (
            <Grid2 xs={12}>
                <Typography variant="h3" component="h3" sx={{textAlign: 'center'}}>{item.sectionTitle}</Typography>
                <Typography variant="subtitle1" sx={{textAlign: 'center'}}>{item.sectionDescription}</Typography>
            </Grid2>
        )
    }
    return null;
};

export default CategoryPageElement;
