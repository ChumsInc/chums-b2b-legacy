import React from 'react';
import RoutedLink from "./RoutedLink";
import ChumsLogo from "../../../components/ChumsLogo";
import Typography from "@mui/material/Typography";
import {SxProps} from "@mui/material/styles";


export default function HomeLink({sx}:{
    sx?:SxProps
}) {
    const sxProps:SxProps = {
        flexGrow: 0,
        display: {
            xs: 'none',
            sm: 'block'
        },
        ...sx
    }
    return (
        <Typography variant="h6" component="div" sx={{flexGrow: 0, display: {xs: 'none', sm: 'block'}, ...sx}}>
            <RoutedLink to="/" className="nav-link home-link">
                <ChumsLogo />
            </RoutedLink>
        </Typography>
    )
}
