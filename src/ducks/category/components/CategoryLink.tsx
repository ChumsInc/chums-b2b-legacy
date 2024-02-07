import React from 'react';
import {Link as RoutedLink} from 'react-router-dom';
import CategoryGridItem from "./CategoryGridItem";
import ResponsiveProductImage from "../../../components/ResponsiveProductImage";
import Link from "@mui/material/Link";

const CategoryLink = ({title, keyword, description, imageUrl, className = ''}: {
    title: string;
    keyword: string;
    description: string;
    imageUrl: string;
    className?: string;
}) => {
    return (
        <CategoryGridItem className={className}>
            <Link component={RoutedLink} to={`/products/${keyword}`} underline="hover">
                <ResponsiveProductImage filename={imageUrl} title={title} alt={title}
                                        preferredSize={400}/>
                <div className="product-title">{title}</div>
            </Link>
            <div className="description">
                <div dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </CategoryGridItem>
    );
}

export default CategoryLink;
