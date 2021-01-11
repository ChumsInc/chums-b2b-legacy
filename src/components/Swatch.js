import React from 'react';
import classNames from "classnames";
import {CONTENT_PATH_SWATCH} from "../constants/paths";
import {} from '../utils/products';
import {parseColor} from "../utils/products";

const SwatchImage = ({material, color}) => {
    if (!material.path || !color.code) {
        return null;
    }
    const swatch = CONTENT_PATH_SWATCH
        .replace(':path', material.path.replace(/^\//, ''))
        .replace(':color', color.code)
        .replace(':filetype', material.filetype);
    const text = `${color.name}`;
    return (<img src={swatch} alt={text} title={text} />)
};

const Swatch = ({color = {}, itemQuantity = null, swatchFormat = '?', active = false, onClick}) => {
    const swatchClassname = parseColor(`color-swatch color-swatch--${swatchFormat}`, color.swatchCode || color.code);
    return (
        <div className={classNames('swatch', {active})} onClick={() => onClick(color.code)}>
            <div className="color-code">{color.code}</div>
            {!!itemQuantity && <div className="color-qty">x{itemQuantity}</div>}
            <div className={swatchClassname} />
        </div>
    )
};

export default Swatch;

