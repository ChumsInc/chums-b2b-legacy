import React from 'react';
import Link, {LinkProps} from "@mui/material/Link";
import {Link as RouterLink} from 'react-router-dom';


interface RoutedLinkProps extends LinkProps {
    to: string;
    replace?: boolean;
}
export default function RoutedLink(props:RoutedLinkProps) {
    return <Link underline="hover" {...props} component={RouterLink as any} />
}
