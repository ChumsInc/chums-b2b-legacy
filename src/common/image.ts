/**
 * Created by steve on 1/10/2017.
 */
import {parseColor} from "../utils/products";
import {sendGtagEvent} from "../api/gtag";

export const parseImageFilename2 = ({image, colorCode}:{image:string; colorCode?: string|null;}) => parseColor(image, colorCode ?? '');

export function parsePossiblyMissingFilename(productImage: string|null, colorCode?: string|null):string|null {
    if (!productImage) {
        return null;
    }
    return parseImageFilename(productImage, colorCode);
}

export function parseImageFilename(productImage:string, colorCode?:string|null):string {
    if (!productImage.trim()) {
        sendGtagEvent('exception', {description: 'Invalid product image', fatal: false})
        return 'missing-placeholder2.jpg';
    }
    let image:string = productImage.replace(/\?/, colorCode ?? '');
    if (colorCode) {
        colorCode.split('').map(code => {
            image = image!.replace(/\*/, code);
        });
    }

    return image.replace(/\*/g, '').replace(/\s/g, '%20');
}
