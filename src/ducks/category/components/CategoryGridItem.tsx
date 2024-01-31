import React from 'react';
import Grid2 from "@mui/material/Unstable_Grid2";

export interface CategoryGridItemProps {
    className?: string;
    children?: React.ReactNode;
}
const CategoryGridItem = ({className, children}:CategoryGridItemProps) => {

    return (
        <Grid2 xs={6} sm={4} md={3}  className={className} sx={{marginBottom: 5, textAlign: 'center'}}>
            {children}
        </Grid2>
    )
}

export default CategoryGridItem;
