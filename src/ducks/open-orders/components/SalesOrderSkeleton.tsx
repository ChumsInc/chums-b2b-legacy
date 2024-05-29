import React from 'react';
import {useParams} from "react-router-dom";
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton';

export default function SalesOrderSkeleton() {
    return (
        <Grid container spacing={2}>
            <Grid xs={12} lg={6}>
                <Stack direction="column" spacing={2}>
                    <Skeleton variant="rectangular" height={30} />
                    <Skeleton variant="rectangular" height={30} />
                    <Skeleton variant="rectangular" height={30} />
                </Stack>
            </Grid>
            <Grid xs={12} lg={6}>
                <Stack direction="column" spacing={2}>
                    <Skeleton variant="rectangular" height={30} />
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="rectangular" height={30} />
                </Stack>
            </Grid>
        </Grid>
    )
}
