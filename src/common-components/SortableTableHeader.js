import React, {Component} from 'react';
import PropTypes from "prop-types";
import ThSortable from "./ThSortable";


export default class SortableTableHeader extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string,
            title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
            noSort: PropTypes.bool,
            className: PropTypes.string,
        })),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),

        onClickSort: PropTypes.func,
    };

    static defaultProps = {
        fields: [],
        sort: {
            field: '',
            asc: true
        },
    };

    render() {
        const {fields, sort} = this.props;
        return (
            <thead>
            <tr>
                {fields.map(({field, title = null, noSort = false, className = ''}) => (
                    <ThSortable key={field} currentSort={sort} onClick={this.props.onClickSort}
                                className={className}
                                field={field} noSort={noSort}>
                        {title || field}
                    </ThSortable>)
                )}
            </tr>
            </thead>
        );
    }
}
