/**
 * Created by steve on 1/10/2017.
 */
import {parseColor} from "../utils/products";

export const parseImageFilename2 = ({image, colorCode = ''}) => parseColor(image, colorCode);


export function parseImageFilename(productImage, colorCode) {
    if (productImage === null || colorCode === null) {
        return '';
    }
    if (typeof colorCode !== 'string') {
        colorCode = colorCode.toString();
    }
    productImage = productImage.replace(/\?/, colorCode);
    colorCode.split('').map(code => {
        productImage = productImage.replace(/\*/, code);
    });
    productImage = productImage.replace(/\*/g, '');
    return productImage;
}
