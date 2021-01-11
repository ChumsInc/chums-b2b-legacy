/**
 * Created by steve on 9/15/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import MaterialIcon from "./MaterialIcon";

const SortIcon = ({asc = true}) => {
    return (<MaterialIcon size={12} icon={asc ? 'arrow_upward' : 'arrow_downward'} />)
};

export default class ThSortable extends Component {
    static propTypes = {
        field: PropTypes.string.isRequired,
        currentSort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }).isRequired,
        className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        noSort: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        currentSort: {
            field: '',
            asc: true,
        },
        className: '',
        noSort: false,
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.field);
    }
    render() {
        const {currentSort, field, noSort, children, className} = this.props;
        const _className = {
            sortable: 'true',
            sorted: currentSort.field === field,
            desc: currentSort.field === field && currentSort.asc === false,
        };
        return noSort
            ? (<th>{children}</th>)
            : (
                <th className={classNames(className, _className)}
                    onClick={this.onClick}>
                    {children}
                    {currentSort.field === field && <SortIcon asc={currentSort.asc}/>}
                </th>
            )
    }
}
