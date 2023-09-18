/**
 * Created by steve on 11/8/2016.
 */

import React from 'react';
import {parseImageFilename2} from '../common/image';
import Carousel from "./Carousel";
import {CONTENT_PATH_PRODUCT_IMAGE, CONTENT_PATH_PRODUCT_MISSING_IMAGE} from "../constants/paths";
import classNames from 'classnames';
import {ProductAlternateImage} from "b2b-types";

export interface ProductImageProps {
    image: string;
    altImages?: ProductAlternateImage[],
    selectedItem?: string | null;
    colorCode?: string;
    size?: string | number;
    className?: string;
    title?: string;
    altText?: string;
    loading?: boolean;
}

/**
 * @TODO: Add alternate images from variants if available, eliminate duplicates.
 * @TODO: Allow custom images in mixes.
 */
export default function ProductImage({image, altImages = [], selectedItem = null, colorCode = '', size = '800', className = '', title = '', altText = '', loading = false}: ProductImageProps) {


    const selectedItemHash = `#${selectedItem}`;
    const filter = /^#[A-Z0-9]+/i;
    const carouselImages = altImages
        .filter(img => !!img.status)
        .filter(img => {
            return !filter.test(img.altText) || (img.altText === selectedItemHash);
        });

    const filename = parseImageFilename2({image, colorCode});
    const src = loading === true || filename === ''
        ? CONTENT_PATH_PRODUCT_MISSING_IMAGE
        : CONTENT_PATH_PRODUCT_IMAGE.replace(':size', encodeURIComponent(size)).replace(':image', encodeURIComponent(filename));
    return (
        <div className="product-image-container">
            {carouselImages.length === 0
                ? <img src={src} className={classNames(className, {loading: filename === ''})}
                       alt={altText || colorCode} title={title}
                       width={size} height={size}/>
                : <Carousel mainImage={image} images={carouselImages}/>
            }
        </div>
    );
}
