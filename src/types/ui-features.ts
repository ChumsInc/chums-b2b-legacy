import {SxProps} from "@mui/system";

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
