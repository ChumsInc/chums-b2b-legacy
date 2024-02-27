import React from 'react';
import {Product} from "b2b-types";
import Stack, {StackProps} from "@mui/material/Stack";
import SizeIconList from "../../../components/SizeIconList";
import ProductAttributeChip from "./ProductAttributeChip";

export interface ProductAttributeStackProps extends StackProps {
    product: Product;
    isNew?: boolean;
}

export default function ProductAttributeStack({
                                                  product,
                                                  spacing,
                                                  direction,
                                                  flexWrap,
                                                  justifyContent,
                                                  alignItems,
                                                  isNew,
                                                  ...rest
                                              }: ProductAttributeStackProps) {
    return (
        <Stack spacing={spacing ?? 1} direction={direction ?? "row"} flexWrap={flexWrap ?? "wrap"}
               justifyContent={justifyContent ?? "center"} alignItems={alignItems ?? "center"} {...rest}>
            {!!product.additionalData?.size && (<SizeIconList size={product.additionalData.size} spacing={0}/>)}
            {isNew && <ProductAttributeChip feature="new"/>}
            {product.additionalData?.best_seller && <ProductAttributeChip feature="best-seller"/>}
            {product.canScreenPrint && <ProductAttributeChip feature="screen-printing"/>}
            {product.canDome && <ProductAttributeChip feature="dome"/>}
            {!!product.additionalData?.upcycled && <ProductAttributeChip feature="upcycled"/>}
            {!!product.additionalData?.heatTransfer && <ProductAttributeChip feature="heat-transfer"/>}
            {!!product.additionalData?.sublimation && <ProductAttributeChip feature="sublimation"/>}
            {!!product.additionalData?.rfidBlocking && <ProductAttributeChip feature="rfid-blocking"/>}
        </Stack>
    )
}

