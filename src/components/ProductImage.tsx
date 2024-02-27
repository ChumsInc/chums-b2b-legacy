/**
 * Created by steve on 11/8/2016.
 */

import React from 'react';
import {parseImageFilename, parseImageFilename2} from '../common/image';
import {CONTENT_PATH_PRODUCT_IMAGE, CONTENT_PATH_PRODUCT_MISSING_IMAGE} from "../constants/paths";
import classNames from 'classnames';
import {ProductAlternateImage} from "b2b-types";
import Box from "@mui/material/Box";
import ProductImageList from "./ProductImageList";

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
export default function ProductImage({
                                         image,
                                         altImages = [],
                                         selectedItem = null,
                                         colorCode = '',
                                         size = '800',
                                         className = '',
                                         title = '',
                                         altText = '',
                                         loading = false
                                     }: ProductImageProps) {
    const selectedItemHash = `#${selectedItem}`;
    const filter = /^#[A-Z0-9]+/i;
    const carouselImages = altImages
        .filter(img => !!img.status)
        .filter(img => {
            return !filter.test(img.altText) || img.altText.includes(selectedItemHash);
        });

    const mainImage: ProductAlternateImage = {
        id: 0,
        productId: 0,
        image: parseImageFilename(image, colorCode),
        altText,
        status: true,
        priority: -1,
    }

    return (
        <ProductImageList images={[mainImage, ...carouselImages]}/>
    );
}
