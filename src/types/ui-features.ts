import {SxProps} from "@mui/system";
import {ContentPage} from "b2b-types";

export interface NavItemProps {
    inDrawer?: boolean;
}

export interface NavItem {
    id: string;
    title?: string;
    render?: ({inDrawer}: NavItemProps) => React.ReactNode;
}

export interface BannerImage {
    filename: string;
    width: number;
    height: number;
}


export interface Banner {
    id: number;
    title: string;
    priority: number|null;
    url: string | null;
    startDate: string | null;
    endDate: string | null;
    active: boolean;
    image?: null | {
        desktop: BannerImage;
        mobile?: BannerImage;
    },
    overlay?: null | {
        sxProps?: SxProps;
        innerText: string;
    }
    src?: string|null;
    sxProps?: SxProps|null;
}

export interface CachedContentPage extends ContentPage {
    lastUsed?: number;
}
