import React from 'react';
import classNames from "classnames";
import {parseColor} from '../../../utils/products';
import {ProductColor} from "b2b-types";
import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MiniChip from "../../../components/MiniChip";

const SwatchButton = styled(Button)`
    width: 48px;
    min-width: 48px;
    padding: 3px;
    margin: 3px;
`;

const NewColorChip = styled(MiniChip)`
    background-color: var(--chums-red);
    color: #FFF;
    margin-top: 1px;
    border-radius: 0;
    width: 100%;
    height: 0.75rem;
`;

const SwatchImage = styled(Box)`
    width: 42px;
    height: 42px;
    display: block;
    background-size: contain;
`;

const Swatch = ({color, itemQuantity, swatchFormat = '?', active = false, newColor, onClick}: {
    color: ProductColor | null;
    itemQuantity?: number;
    swatchFormat: string;
    active: boolean;
    newColor?: boolean;
    onClick: (code: string | null) => void;
}) => {
    const swatchClassname = parseColor(`color-swatch color-swatch--${swatchFormat}`, color?.swatchCode || color?.code);
    const clickHandler = () => {
        onClick(color?.code ?? null)
    }
    return (
        <SwatchButton variant={active ? 'outlined' : "text"}
                      // sx={{borderColor: !active ? 'transparent' : undefined}}
                      className="swatch" onClick={clickHandler}>
            <Stack direction="column">
                <Box className="color-code">{color?.code}</Box>
                {!!itemQuantity && <Box className="color-qty">x{itemQuantity}</Box>}
                <SwatchImage className={swatchClassname}/>
                {newColor && <NewColorChip label="New" /> }
            </Stack>
        </SwatchButton>
    )
};

export default Swatch;

