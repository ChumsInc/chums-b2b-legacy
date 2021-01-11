import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

const Tab = ({active = false, id, title, path, onSelect}) => {
    const onClick = (ev) => {
        if (!!path) {
            return;
        }
        ev.preventDefault();
        onSelect(id);
    };
    return (
        <li className="nav-item">
            <Link className={classNames('nav-link', {active})} to={path || '#'} onClick={onClick}>{title}</Link>
        </li>
    );
};

const Tabs = ({tabList = [], activeTab, onSelect}) => (
    <ul className="nav nav-tabs mb-2">
        {tabList.map(tab => <Tab key={tab.id} {...tab} active={activeTab === tab.id} onSelect={(id) => onSelect(id)}/>)}
    </ul>
);

export default Tabs;
