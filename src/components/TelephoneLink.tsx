import React from 'react';
import Link from "@mui/material/Link";

const TelephoneLink = ({telephoneNo}: { telephoneNo: string | null }) => {
    if (!telephoneNo) {
        return null;
    }
    return (
        <Link href={`tel:${telephoneNo}`} color="inherit">
            {telephoneNo}
        </Link>
    )
}

export default TelephoneLink;
