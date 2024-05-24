import React from 'react';
import {Slide} from "b2b-types";
import {Link as RoutedLink} from 'react-router-dom';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";

const HomeSlide = ({slide}: {
    slide: Slide;
}) => {
    let sxProps: SxProps = {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        minHeight: '10rem',
        padding: '3rem',
        '&:hover': {
            backgroundColor: 'var(--chums-red)',
            transition: 'ease-in-out 350ms',
        }
    };
    if (slide.mainImage) {
        sxProps = {
            ...sxProps,
            backgroundImage: slide.mainImage,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        };
    }
    return (
        <Paper elevation={1}>
            <Link component={RoutedLink} to={slide.actionURL ?? '/'}
                  color="inherit" underline="none">
                <Box sx={sxProps}>
                    <Tooltip title={JSON.stringify(slide, undefined, 2)}>
                        <h2 dangerouslySetInnerHTML={{__html: slide.mainOverlay}}></h2>
                    </Tooltip>
                </Box>
            </Link>
        </Paper>

    )
}

export default HomeSlide;
