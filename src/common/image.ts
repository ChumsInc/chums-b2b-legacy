/**
 * Created by steve on 1/10/2017.
 */
import {parseColor} from "../utils/products";

export const parseImageFilename2 = ({image, colorCode}:{image:string; colorCode?: string|null;}) => parseColor(image, colorCode ?? '');


export function parseImageFilename(productImage?:string|null, colorCode?:string|null) {
    if (!productImage || !colorCode) {
        return '';
    }
    let image:string = productImage.replace(/\?/, colorCode);
    colorCode.split('').map(code => {
        image = image!.replace(/\*/, code);
    });

    return image.replace(/\*/g, '').replace(/\s/g, '%20');
}
