export interface NavItemProps {
    inDrawer?: boolean;
}
export interface NavItem {
    id: string;
    title?: string;
    render?: ({inDrawer}:NavItemProps) => React.ReactNode;
}
