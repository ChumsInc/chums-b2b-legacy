import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

export default class Badge extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['primary', 'success', 'info', 'secondary', 'danger', 'error', 'warning', 'light', 'dark']),
        text: PropTypes.string,
        url: PropTypes.string,
        backgroundColor: PropTypes.string,
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    };

    static defaultProps = {
        type: 'info',
        text: '',
        className: '',
        url: null,
    };

    render() {
        const {type, text, backgroundColor, children, url, className} = this.props;
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
}
