import React from 'react';
import {useSelector} from 'react-redux';
import {selectProductMenu} from "../index";
import {defaultMenuSorter} from "../utils";
import MenuColumn from "./MenuColumn";

const productUrl = (url: string) => `/products${url}`;

const ProductSubNav: React.FC = () => {
    const menu = useSelector(selectProductMenu);
    const items = menu?.items || [];

    if (!menu || !items) {
        return null;
    }
    return (
        <div className="chums-subnavbar-collapse collapse show">
            <ul className="navbar-nav">
                {[...items]
                    .sort(defaultMenuSorter)
                    .map(item => (
                        <MenuColumn key={item.id} item={item} urlFormatter={productUrl}/>
                    ))
                }
            </ul>
        </div>
    );
}

export default ProductSubNav;
