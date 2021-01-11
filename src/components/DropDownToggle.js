import React from 'react';
import classNames from 'classnames';

const DropDownToggle = ({title, active = false, show = false, onClick}) => {
    return (
        <li className={classNames("nav-item dropdown", {show, active})}>
            <div className={classNames("nav-link subnav-toggle", {collapsed: !show})}
                 role="button"
                 aria-haspopup={true}
                 aria-expanded={show}
                 onClick={() => onClick()}>
                {title}
            </div>
        </li>
    )
}

export default DropDownToggle;
