import {Banner} from "b2b-types";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import Typography from "@mui/material/Typography";
import BannerLinkWrapper from "./BannerLinkWrapper";

const defaultSxProps:SxProps = {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    minHeight: '10rem',
    padding: '3rem',
    '&:hover': {
        backgroundColor: 'var(--chums-red)',
        transition: 'ease-in-out 350ms',
    }
}
export interface TextBannerProps {
    banner: Banner;
}
const TextBanner = ({banner}:TextBannerProps) => {
    if (!banner.overlay) {
        return null;
    }

    return (
        <BannerLinkWrapper banner={banner}>
            <Box sx={{...defaultSxProps, ...(banner.sxProps ?? {})}}>
                <Typography variant="body1" sx={{...(banner.overlay.sxProps ?? {})}}>
                    {banner.overlay.innerText}
                </Typography>
            </Box>
        </BannerLinkWrapper>
    )
}

export default TextBanner;
