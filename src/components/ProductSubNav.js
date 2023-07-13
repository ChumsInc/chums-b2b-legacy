import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';

import SubNavColumn from "./SubNavColumn";
import {selectMenuItems} from "../ducks/menu";

const sortPriority = (a, b) => a.priority === b.priority
    ? (a.title === b.title ? 0 : (a.title > b.title ? 1 : -1))
    : a.priority > b.priority ? 1 : -1;

const productUrl = (url) => `/products${url}`;

const ProductSubNav = () => {
    const items = useSelector(selectMenuItems);
    return (
        <div className="chums-subnavbar-collapse collapse show">
            <ul className="navbar-nav navbar-products">
                {items
                    .filter(item => !!item.status)
                    .sort(sortPriority)
                    .map(item => (
                        <SubNavColumn key={item.id} url={item.url} title={item.title} subMenu={item.menu}
                                      urlFormatter={productUrl} itemSorter={sortPriority}/>
                    ))
                }
            </ul>
        </div>
    )
}

export default ProductSubNav;
