import React from "react";
import SubNavItem from "./SubNavItem";
import {defaultFormatter, defaultMenuSorter} from "../utils";
import {MenuItem} from "b2b-types";


export interface SubNavItemListProps {
    items: MenuItem[],
    urlFormatter?: (val: string) => string,
    itemSorter?: (a: MenuItem, b: MenuItem) => number,
}

const SubNavItemList: React.FC<SubNavItemListProps> = ({
                                                           items = [],
                                                           urlFormatter = defaultFormatter,
                                                           itemSorter = defaultMenuSorter
                                                       }) => {
    return (
        <ul className="navbar-nav">
            {[...items]
                .sort(itemSorter)
                .map((item, index) => (
                    <SubNavItem key={item.id || index} title={item.title} description={item.description}
                                url={urlFormatter(item.url)}/>
                ))}
        </ul>
    )
};

export default SubNavItemList
