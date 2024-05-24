import React from 'react';
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {visuallyHidden} from '@mui/utils'

export type SizeCode = 'S'|'M'|'L';

export type SizeIconList = {
    [key in SizeCode]: string;
};
const iconSource:SizeIconList = {
    S: '/images/chums/icons/retainer_sm.png',
    M: '/images/chums/icons/retainer_md.png',
    L: '/images/chums/icons/retainer_lg.png',
}

const sizeName:SizeIconList = {
    S: 'SMALL',
    M: 'MEDIUM',
    L: 'LARGE',
}

const SizeIcon = ({size}:{size:SizeCode}) => {
    const src = iconSource[size] ?? null;
    if (!src) {
        return null;
    }

    return (
        <img src={src} alt={size} style={{width: '25px', height: 'auto',  maxWidth: '100%', verticalAlign: 'middle'}}/>
    )
}

const SizeIconDescription = ({size}:{size:SizeCode}) => {
    if (!sizeName[size]) {
        return null;
    }
    return (
        <Box sx={visuallyHidden}>
            Fits size: {sizeName[size]}
        </Box>
    )
}
const SizeIconContainer = ({size}:{size: SizeCode}) => {
    return (
        <Box>
            <SizeIcon size={size}/>
            <SizeIconDescription size={size}/>
        </Box>
    )
}

const SizeIconList = ({size, spacing}:{size: string, spacing?: number}) => {

    const sizes = size.split(',').map(s => s.trim()).map(s => s.toLowerCase());
    if (!size || !sizes.length) {
        return null;
    }
    return (
        <Stack direction="row" spacing={spacing ?? 1}>
            {(sizes.includes('s') || sizes.includes('sm')) && (
                <SizeIconContainer size="S"/>
            )}
            {(sizes.includes('m') || sizes.includes('md')) && (
                <SizeIconContainer size="M"/>
            )}
            {(sizes.includes('l') || sizes.includes('lg')) && (
                <SizeIconContainer size="L"/>
            )}
        </Stack>
    )
}

export default SizeIconList;
