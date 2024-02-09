import React from "react";
import {useAppSelector} from "../../../app/configureStore";
import {selectSlides} from "../index";
import Box from "@mui/material/Box";
import HomeSlide from "./HomeSlide";
import Stack from "@mui/material/Stack";

const HomeSlideSet = () => {
    const slides = useAppSelector(selectSlides);

    return (
        <Box maxWidth="xl">
            <Stack direction="column" spacing={2}>
                {slides.map(slide => <HomeSlide slide={slide} key={slide.id} />)}
            </Stack>
        </Box>
    )
}

export default HomeSlideSet;
