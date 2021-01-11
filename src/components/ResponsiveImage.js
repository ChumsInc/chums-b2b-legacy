import React from 'react';
import parse from 'path-parse';


export const SLIDE_SIZES = [480, 640, 840, 1600, 2000];
export const SLIDE_SIZE_NAMES = ['-xs', '-sm', '-md', '-lg', '-xl'];

/**
 *
 * @param {String} src
 * @param {String} className
 * @param {String} alt
 * @param {Number[]} sizes
 * @param {String[]} sizeNames
 * @return {*}
 * @constructor
 */
const ResponsiveImage = ({src, className, alt, sizes = SLIDE_SIZES, sizeNames = SLIDE_SIZE_NAMES}) => {

    const {dir, name, ext} = parse(src);
    const imageSizes = sizes
        .map((size, index) => {
            return index < sizes.length - 1
                ? `(max-width: ${size}px) ${size}px`
                : `${size}px`
        })
        .join(',');
    const srcSet = sizes
        .map((size, index) => `${dir}/${name}${sizeNames[index]}${ext} ${size}w`)
        .join(',');
    return (
        <img className={className}
             alt={alt}
             src={ `${dir}/${name}${sizeNames[sizes.length - 1]}${ext}`}
             srcSet={srcSet}
             sizes={imageSizes} />
    )
};

export default ResponsiveImage;
