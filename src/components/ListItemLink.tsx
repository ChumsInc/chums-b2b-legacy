import React from "react";
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from 'react-router-dom';
import ListItem, {ListItemProps} from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';


export interface ListItemLinkProps extends ListItemProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(
    itemProps,
    ref,
) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

export default function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to, ...rest } = props;

    return (
        <ListItem component={Link} to={to} sx={{color: 'theme.palette.common.black'}} {...rest}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
        </ListItem>
    );
}
