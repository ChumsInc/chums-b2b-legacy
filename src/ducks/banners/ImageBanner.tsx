import React from 'react';
import {Banner} from "b2b-types";
import BannerLinkWrapper from "./BannerLinkWrapper";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import Typography from "@mui/material/Typography";

const bannerImagePath = (filename: string) => `/images/chums/homepage/${filename.replace(/^\//, '')}`;

export default function ImageBanner({banner}: { banner: Banner }) {
    if (!banner.image || (!banner.image.desktop?.filename && !banner.image.mobile?.filename)) {
        return null;
    }

    const defaultSxProps: SxProps = {
        position: !!banner.image.desktop?.overlay || !!banner.image.mobile?.overlay ? 'relative' : undefined,
        height: 'fit-content',
    }

    const overlaySxProps: SxProps = {
        position: defaultSxProps.position === 'relative' ? 'absolute' : undefined,
        ...(banner.image.mobile?.overlaySxProps ?? {}),
        md: {
            ...(banner.image.desktop?.overlaySxProps ?? {})
        }
    }


    const src = bannerImagePath(banner.image.desktop?.filename ?? banner.image.mobile?.filename ?? '');
    return (
        <BannerLinkWrapper banner={banner}>
            <Box sx={{...defaultSxProps, ...(banner.sxProps ?? {})}}>
                <picture>
                    {banner.image.mobile?.filename && (
                        <source media={`(max-width: ${banner.image.mobile?.width || 480}px)`}
                                srcSet={bannerImagePath(banner.image.mobile.filename)}/>)}
                    {banner.image.desktop?.filename && (
                        <source media={`(min-width: ${(banner.image.mobile?.width || 480) + 1}px)`}
                                srcSet={bannerImagePath(banner.image.desktop.filename)}/>)}
                    <Box component="img"
                         width={{xs: banner.image.mobile?.width || 480, sm: banner.image.desktop?.width || 1600}}
                         height={{xs: banner.image.mobile?.height || 600, sm: banner.image.desktop?.height || 500 }}
                         src={src}
                         alt={banner.image.desktop?.altText ?? banner.image.mobile?.altText ?? ''}
                         sx={{maxWidth: '100%', height: 'auto'}}
                    />
                </picture>
                <Typography variant="body1"
                            sx={overlaySxProps}>{banner.image.desktop?.overlay ?? banner.image.mobile?.overlay}</Typography>
            </Box>
        </BannerLinkWrapper>
    )
}
