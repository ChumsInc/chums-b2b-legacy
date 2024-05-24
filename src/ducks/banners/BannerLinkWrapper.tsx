import {Banner} from "b2b-types";
import {Link as NavLink} from "react-router-dom";
import Link, {LinkProps} from '@mui/material/Link'


const isOutsideLink = /([a-z]+:)*\/\//;

export interface BannerLinkWrapperProps extends LinkProps {
    banner: Banner;
}
export default function BannerLinkWrapper({banner, children, ...rest}:BannerLinkWrapperProps) {
    if (!banner.url) {
        return children;
    }

    if (isOutsideLink.test(banner.url)) {
        return (
            <Link href={banner.url} underline="none" target="_blank" {...rest}>{children}</Link>
        );
    }
    return (
        <Link component={NavLink} to={banner.url} underline="none" {...rest}>{children}</Link>
    )
}
