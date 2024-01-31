import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {BreadcrumbPath} from "../types/breadcrumbs";
import {useLocation} from "react-router";
import {Breadcrumbs} from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link'


const BreadcrumbItem = ({title, pathname, active = false}: BreadcrumbPath) => (
    active
        ? <Typography aria-current="page">{title}</Typography>
        : <Link component={RouterLink} to={pathname}>{title}</Link>
);

const Breadcrumb = ({paths}: {
    paths: BreadcrumbPath[]
}) => {
    const location = useLocation();
    return (
        <Breadcrumbs>
            {paths.map((path, index) => (
                <BreadcrumbItem key={index} {...path} active={path.pathname === location.pathname}/>
            ))}
        </Breadcrumbs>
    );
}

export default Breadcrumb;
