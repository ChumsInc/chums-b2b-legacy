/**
 * Created by steve on 3/29/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const PAGE_LABELS = {
    prev: '‹',
    ellipsis: '…',
    next: '›',
};

const DEFAULT_MAX_PAGES = 9;

const CurrentPageButton = ({page, label = null}) => {
    return (
        <li className={classNames('page-item active')}>
            <span className="page-link">{label || page}</span>
        </li>
    )
};

const SelectablePageButton = ({page, label = null, disabled = false, onClick}) => {
    const handleClick = (ev) => {
        ev.preventDefault();
        onClick(page);
    };
    return (
        <li className={classNames('page-item', {disabled: disabled})}>
            <a href="#" className='page-link' onClick={handleClick}>{label || page}</a>
        </li>
    )
};

const PageButton = ({page, label = '', disabled = false, isCurrent = false, onClick}) => {
    return (
        isCurrent
            ? <CurrentPageButton page={page} label={label}/>
            : <SelectablePageButton page={page} label={label} disabled={disabled} onClick={onClick}/>
    )
};

export default class Pagination extends Component {
    static propTypes = {
        maxButtons: PropTypes.number,
        activePage: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired,
        onSelect: PropTypes.func.isRequired,
        filtered: PropTypes.bool,
    };

    static defaultProps = {
        maxButtons: DEFAULT_MAX_PAGES,
        activePage: 1,
        pages: 1,
        filtered: false,
    };

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(page) {

        if (page < 1 || page > this.props.pages) {
            return;
        }
        this.props.onSelect(page);
    }

    render() {
        const {maxButtons = DEFAULT_MAX_PAGES, activePage, pages, filtered} = this.props;
        if (pages === 0) {
            return null;
        }

        const hasMore = pages > maxButtons;
        const maxPageButtons = pages > maxButtons ? maxButtons - 2 : maxButtons;

        let renderPages = [];
        const pageRange = Math.floor(maxPageButtons / 2);
        const beforeRender = Math.min(activePage - pageRange, pages - maxPageButtons);
        const afterRender = Math.max(activePage + pageRange, maxPageButtons);
        const firstEllipsis = [];
        const lastEllipsis = [];
        for (let i = 2; i < pages; i += 1) {
            if (i <= beforeRender) {
                firstEllipsis.push(i);
            } else if (i < afterRender) {
                renderPages.push(i);
            } else {
                lastEllipsis.push(i);
            }
        }

        return (
            <nav aria-label="Page Navigation">
                <ul className={classNames("pagination", {filtered})}>
                    {hasMore && (
                        <PageButton page={activePage - 1} label={PAGE_LABELS.prev} disabled={activePage <= 1}
                                    onClick={this.onSelect}/>
                    )}
                    <PageButton page={1} label={1} onClick={this.onSelect} isCurrent={activePage === 1}/>
                    {hasMore && firstEllipsis.length === 1 && (
                        <PageButton page={firstEllipsis[0]} label={firstEllipsis[0]}/>
                    )}
                    {hasMore && firstEllipsis.length > 1 && (
                        <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true}/>
                    )}
                    {renderPages.map(p => (
                        <PageButton key={p} page={p} isCurrent={p === activePage} onClick={this.onSelect}/>
                    ))}
                    {hasMore && lastEllipsis.length === 1 && (
                        <PageButton page={lastEllipsis[0]} label={lastEllipsis[0]}/>
                    )}
                    {hasMore && lastEllipsis.length > 1 && (
                        <PageButton page={0} label={PAGE_LABELS.ellipsis} disabled={true}/>
                    )}
                    {pages > 1 && (
                        <PageButton page={pages} label={pages} isCurrent={pages === activePage}
                                    onClick={this.onSelect}/>
                    )}
                    {hasMore && (
                        <PageButton page={activePage + 1} label={PAGE_LABELS.next}
                                    onClick={this.onSelect}
                                    disabled={activePage === pages}/>
                    )}
                </ul>
            </nav>
        )
    }
}
