import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {loadBanners, selectBannersList, selectBannersLoaded} from "./index";
import {useEffect} from "react";
import HomeBanner from "./HomeBanner";
import Stack from "@mui/material/Stack";

const BannersList = () => {
    const dispatch = useAppDispatch();
    const banners = useAppSelector(selectBannersList);
    const loaded = useAppSelector(selectBannersLoaded);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadBanners())
        }
    }, [loaded]);

    if (!banners.length) {
        return null;
    }

    return (
        <Stack direction="column" spacing={2} sx={{mb: 2}}>
            {banners.map(banner => (<HomeBanner key={banner.id} banner={banner} />))}
        </Stack>
    )
}

export default BannersList;
