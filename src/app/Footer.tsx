import React from 'react';
import AppVersion from "../ducks/version/AppVersion";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {visuallyHidden} from '@mui/utils'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Stack from "@mui/material/Stack";

const SiteFooter = styled(Box)(({theme}) => ({
    width: '100%',
    maxWidth: '100%',
}));

const ContactsContainer = styled(Stack)(({theme}) => ({
    backgroundColor: '#000000',
    color: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const AddressBox = styled(Box)(({theme}) => ({
    padding: 'var(--footer-contacts-padding)',
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
        textAlign: 'left'
    }
}))

const SocialIconStack = styled(Stack)`
    padding: var(--footer-contacts-padding);
`

const BottomLinksContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#262626',
    color: '#EEEEEE',
    fontSize: '12px',
    textTransform: 'uppercase',
    padding: 'calc(var(--footer-contacts-padding) / 2)',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    }
}));

const BottomLinks = styled(Stack)(({theme}) => ({
    margin: '0 7px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '* a': {
        padding: '0 calc(var(--footer-contacts-padding) / 3)',
        color: '#EEEEEE !important',
        whiteSpace: 'nowrap',
        '&:hover': {
            color: theme.palette.primary.light,
        }
    }
}));

const BottomLink = styled(Link)(({theme}) => ({
    color: theme.palette.primary.contrastText,
    padding: '0 0.5rem',
}));




const Footer = () => {
    const date = new Date();
    return (

        <SiteFooter component="footer">
            <ContactsContainer spacing={1} direction={{xs: 'column', sm: 'row'}}>
                <AddressBox>
                    <div><strong>CONTACT US</strong></div>
                    <div>
                        <Typography component="address" variant="body1">
                            <div>2424 SOUTH 2570 WEST</div>
                            <div>SALT LAKE CITY, UT 84119</div>
                            <div>(800) 222-2486</div>
                        </Typography>
                    </div>
                </AddressBox>
                <SocialIconStack sx={{mr: 1}} direction="row" spacing={1}>
                    <BottomLink href="https://www.linkedin.com/company/chums-inc-" target="_blank" rel="noreferrer">
                        <LinkedInIcon />
                        <Box component="span" sx={visuallyHidden}>Follow Chums on LinkedIn</Box>
                    </BottomLink>
                    <BottomLink href="https://www.facebook.com/Chumsusa" target="_blank" rel="noreferrer">
                        <FacebookIcon />
                        <Box sx={visuallyHidden}>Like Chums on Facebook</Box>
                    </BottomLink>
                    <BottomLink href="https://instagram.com/chumsusa" target="_blank" rel="noreferrer">
                        <InstagramIcon />
                        <Box sx={visuallyHidden}>Like Chums on Instagram</Box>
                    </BottomLink>
                </SocialIconStack>
            </ContactsContainer>
            <BottomLinksContainer>
                <Box sx={{ml: {xs: '1rem'}}}><AppVersion /></Box>
                <BottomLinks direction="row" useFlexGap flexWrap="wrap" sx={{display: 'none'}}>
                    <BottomLink underline="hover" href="//chums.com/page/jobs" target="_blank" rel="noreferrer">CAREERS</BottomLink>
                    <BottomLink underline="hover" href="//chums.com/page/customization" target="_blank" rel="noreferrer">CUSTOMIZE</BottomLink>
                    <BottomLink underline="hover" href="//chums.com/page/contact-us" target="_blank" rel="noreferrer">CONTACT</BottomLink>
                    <BottomLink underline="hover" href="//chums.com/page/returns-policy" target="_blank" rel="noreferrer">Returns</BottomLink>
                    <BottomLink underline="hover" href="//chums.com/page/shipping-policy" target="_blank" rel="noreferrer">Shipping</BottomLink>
                    <BottomLink underline="hover" href="//chums.com/page/social-compliance-policy" target="_blank" rel="noreferrer">Social Compliance Policy</BottomLink>
                    <BottomLink underline="hover" href="//chums.com/page/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</BottomLink>
                    <BottomLink underline="hover" href="https://chums.com" target="_blank" rel="noreferrer">CHUMS.COM</BottomLink>
                </BottomLinks>
                <Box sx={{mr: 1}}>
                    © {date.getFullYear()} Chums. All rights reserved
                </Box>
            </BottomLinksContainer>

        </SiteFooter>
    )
};

export default Footer;
