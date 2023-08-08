import React from 'react';
import {Link} from 'react-router-dom';
import {BreadcrumbPath} from "../types/breadcrumbs";
import {useLocation} from "react-router";


const BreadcrumbItem = ({title, pathname, active = false}: {
    title: string;
    pathname: string;
    active: boolean;
}) => (
    active
        ? <li className="breadcrumb-item active" aria-current="page">{title}</li>
        : <li className="breadcrumb-item"><Link to={pathname}>{title}</Link></li>
);

const Breadcrumb = ({paths}: {
    paths: BreadcrumbPath[]
}) => {
    const location = useLocation();
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {paths.map(path => <BreadcrumbItem key={path.pathname} {...path}
                                                   active={path.pathname === location.pathname}/>)}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
