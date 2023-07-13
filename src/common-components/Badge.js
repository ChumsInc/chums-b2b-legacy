import React from 'react';
import classNames from "classnames";

/**
 *
 * @param {'primary'|'success'|'info'|'secondary'|'danger'|'error'|'warning'|'light'|'dark'} [type]
 * @param {string} [text]
 * @param {string|null} [url]
 * @param {string} backgroundColor
 * @param {string|classNames.Argument} className
 * @param {React.ReactNode} [children]
 * @returns {JSX.Element}
 * @constructor
 */
export default function Badge({
                                  type = 'info',
                                  text = '',
                                  url = null,
                                  backgroundColor,
                                  className = '',
                                  children,
                              }) {
    const badgeClassNames = classNames('badge badge-pill', className, {
        'bg-primary': type === 'primary',
        'bg-success': type === 'success',
        'bg-info': type === 'info' || type === undefined,
        'bg-secondary': type === 'secondary',
        'bg-danger': type === 'danger' || type === 'error',
        'bg-warning': type === 'warning',
        'bg-light': type === 'light',
        'bg-dark': type === 'dark',
    });
    if (!!url) {
        return (
            <a href={url} target="_blank"
               className={badgeClassNames}
               style={{backgroundColor}}>
                {text || children || ''}
            </a>
        )
    }
    return (
        <span className={badgeClassNames} style={{backgroundColor}}>{text || children || ''}</span>
    );
}
