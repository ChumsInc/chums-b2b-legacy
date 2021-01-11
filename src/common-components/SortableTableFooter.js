import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import {getClassName} from '../utils/general';


export default class SortableTableFooter extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        footerData: PropTypes.object,
        page: PropTypes.number,
        pages: PropTypes.number,
    };

    static defaultProps = {
        fields: [],
        footerData: {},
    };

    render() {
        const {page, pages, fields, footerData} = this.props;
        return (
            <tfoot>
            {page < pages && <tr>
                <td colSpan={fields.length} className="align-content-center">...</td>
            </tr>}
            <tr>
                {fields.map(({field, render, className = ''}, index) => (
                    <td key={index} className={classNames(getClassName(className, footerData[field]))}>
                        <strong>
                            {footerData[field] !== undefined ? (!!render ? render(footerData) : footerData[field]) : ' '}
                        </strong>
                    </td>
                ))}
            </tr>
            </tfoot>
        );
    }
}
