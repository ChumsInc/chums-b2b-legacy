/**
 * Created by steve on 11/8/2016.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {parseImageFilename2} from '../common/image';
import Carousel from "./Carousel";
import {buildPath} from "../utils/fetch";
import {CONTENT_PATH_PRODUCT_IMAGE, CONTENT_PATH_PRODUCT_MISSING_IMAGE} from "../constants/paths";
import classNames from 'classnames';


/**
 * @TODO: Add alternate images from variants if available, eliminate duplicates.
 * @TODO: Allow custom images in mixes.
 */
export default class ProductImage extends Component {
    static propTypes = {
        image: PropTypes.string.isRequired,
        altImages: PropTypes.array,
        selectedItem: PropTypes.string,
        colorCode: PropTypes.string,
        size: PropTypes.oneOf([80, 125, 400, 800, '80', '125', '400', '800']),
        className: PropTypes.string,
        title: PropTypes.string,
        altText: PropTypes.string,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        image: '../../generic/1px.png',
        altImages: [],
        selectedItem: '',
        colorCode: '',
        size: '800',
        title: '',
        altText: '',
        loading: false,
    };

    render() {
        const {image, altImages, selectedItem, colorCode, altText, size, title, className = 'main-image', loading} = this.props;
        const selectedItemHash = `#${selectedItem}`;
        const filter = /^#[A-Z0-9]+/i;
        const carouselImages = altImages
            .filter(img => !!img.status)
            .filter(img => {
                return filter.test(img.altText) === false
                    || (img.altText === selectedItemHash)
            });

        const filename = parseImageFilename2({image, colorCode});
        const src = loading === true || filename === ''
            ? CONTENT_PATH_PRODUCT_MISSING_IMAGE
            : buildPath(CONTENT_PATH_PRODUCT_IMAGE, {size, image: filename});
        return (
            <div className="product-image-container">
                {carouselImages.length === 0
                    ? <img src={src} className={classNames(className, {loading: filename === ''})}
                           alt={altText || colorCode} title={title}
                           width="800" height="800"/>
                    : <Carousel mainImage={image} images={carouselImages}/>
                }
            </div>
        );
    }


}
