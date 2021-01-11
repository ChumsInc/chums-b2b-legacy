/**
 * Created by steve on 9/8/2016.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ProgressBar extends PureComponent {
    static propTypes = {
        striped: PropTypes.bool,
        label: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        className: PropTypes.string,
        height: PropTypes.number,
        style: PropTypes.object,

    };

    static defaultProps = {
        striped: false,
        label: '',
        value: 100,
        min: 0,
        max: 100,
        style: {},
        height: null,
    };

    render() {
        const {striped, label, value, min, max, className, style, height} = this.props;
        const progressClass = classNames('progress-bar', {
            'progress-bar-striped': striped,
            'progress-bar-animated': striped,
        });
        const _style = {
            ...style,
        };

        if (!!height && style.height === undefined) {
            _style.height = `${height}px`;
        }

        const labelClass = classNames({'sr-only': !!this.props.label});
        const width = value > max || max === 0 ? 100 : (value / max) * 100;
        return (
            <div className={classNames("progress", className)} style={_style}>
                <div className={progressClass} role="progressbar"
                     aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
                     style={{width: `${width}%`}}>
                    <span className={labelClass}>{label}</span>
                </div>
            </div>
        );
    }
}
