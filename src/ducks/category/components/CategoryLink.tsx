import React from 'react';
import {Link} from 'react-router-dom';
import ProductImage from "../../../components/ProductImage";
import classNames from 'classnames';

const CategoryLink = ({title, keyword, description, imageUrl, className = ''}:{
    title: string;
    keyword: string;
    description: string;
    imageUrl: string;
    className?: string;
}) => {
    const selfClassName = {
        'col-sm-3 col-6': !/col/i.test(className),
    };

    return (
        <div className={classNames(className, selfClassName)}>
            <Link className="category" to={`/products/${keyword}`}>
                <ProductImage image={imageUrl} title={title} altText={title} size="400" className="main-image"/>
                <div className="product-title">{title}</div>
            </Link>
            <div className="description">
                <div dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </div>
    );
}

export default CategoryLink;
