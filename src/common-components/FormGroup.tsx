import React, {HTMLAttributes} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {SxProps} from "@mui/system";

export default function FormGroup({
                                      label,
                                      labelProps,
                                      colWidth = 8,
                                      sx = {my: 1},
                                      children
                                  }: {
    label: string;
    labelProps?: HTMLAttributes<HTMLLabelElement>;
    colWidth?: number;
    sx?: SxProps;
    children?: React.ReactNode;
}) {

    return (
        <Grid container sx={sx}>
            <Grid xs={12 - colWidth} component="label" {...labelProps}>
                {label}
            </Grid>
            <Grid xs={colWidth}>
                {children}
            </Grid>
        </Grid>
    )
}


