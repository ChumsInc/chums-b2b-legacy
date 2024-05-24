import React from 'react';
import Typography from "@mui/material/Typography";

export default function MenuLinkProfile({linkCode, linkName}: {
    linkCode: string;
    linkName: string;
}) {
    return (
        <>
            {linkCode}
            <Typography sx={{marginLeft: '1rem', maxWidth: '12rem', fontWeight: 'bold'}} variant="inherit"
                        noWrap>{linkName}</Typography>
        </>
    )
}
