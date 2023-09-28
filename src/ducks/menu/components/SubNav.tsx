import React, {useRef} from 'react';
import ProductSubNav from "./ProductSubNav";
import {SUB_NAV_TYPES} from "../../../constants/app";
import AccountSubNav from "./AccountSubNav";
import OrdersSubNav from "./OrdersSubNav";
import ResourcesSubNav from "./ResourcesSubNav";
import {useClickOutside} from "../../../hooks/clickOutside";

export interface SubNavProps {
    subNav: string,
    onClearMenu: () => void,
}

const SubNav: React.FC<SubNavProps> = ({subNav, onClearMenu}) => {
    const ref = useRef<HTMLDivElement>(null)

    useClickOutside(ref, () => {
        onClearMenu();
    });
    return (
        <div ref={ref} className="chums-subnavbar">
            {subNav === SUB_NAV_TYPES.products && <ProductSubNav/>}
            {subNav === SUB_NAV_TYPES.accounts && <AccountSubNav/>}
            {subNav === SUB_NAV_TYPES.orders && <OrdersSubNav/>}
            {subNav === SUB_NAV_TYPES.resources && <ResourcesSubNav/>}
        </div>
    );
}

export default SubNav;
