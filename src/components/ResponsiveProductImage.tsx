import React, {ImgHTMLAttributes} from 'react';
import {styled} from "@mui/material/styles";

const imageSizes: number[] = [80, 250, 400, 800, 2048];

const ResponsiveImage = styled('img')`
    max-width: 100%;
    width: 100%;
    height: auto;

`

export interface ResponsiveProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    filename?: string;
    preferredSize?: number;
}

const ResponsiveProductImage = ({
                                    filename,
                                    preferredSize,
                                    src,
                                    alt,
                                    loading,
                                    srcSet,
                                    sizes,
                                    ...rest
                                }: ResponsiveProductImageProps) => {
    if (!srcSet) {
        const [nextSize = 2048] = imageSizes.filter(size => size >= (preferredSize ?? 2048));
        srcSet = imageSizes
            .filter(size => size <= nextSize)
            .map(size => `/images/products/${size}/${filename} ${size}w`).join(',')
    }
    return (
        <ResponsiveImage src={src} alt={alt} srcSet={srcSet} sizes={sizes} {...rest}/>
    )
}

export default ResponsiveProductImage;
