import React from 'react';
import classNames from "classnames";
import {CONTENT_PATH_SWATCH} from "@/constants/paths";
import {} from '@/utils/products';
import {parseColor} from "@/utils/products";
import {ProductColor} from "b2b-types";

const Swatch = ({color, itemQuantity, swatchFormat = '?', active = false, onClick}:{
    color: ProductColor|null;
    itemQuantity?: number;
    swatchFormat: string;
    active: boolean;
    onClick: (code: string | null) => void;
}) => {
    const swatchClassname = parseColor(`color-swatch color-swatch--${swatchFormat}`, color?.swatchCode || color?.code);
    return (
        <div className={classNames('swatch', {active})} onClick={() => onClick(color?.code ?? null)}>
            <div className="color-code">{color?.code}</div>
            {!!itemQuantity && <div className="color-qty">x{itemQuantity}</div>}
            <div className={swatchClassname} />
        </div>
    )
};

export default Swatch;

