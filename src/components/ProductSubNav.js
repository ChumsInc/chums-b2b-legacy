import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import SubNavColumn from "./SubNavColumn";

const sortPriority = (a, b) => a.priority === b.priority
    ? (a.title === b.title ? 0 : (a.title > b.title ? 1 : -1))
    : a.priority > b.priority ? 1 : -1;

const productUrl = (url) => `/products${url}`;

class ProductSubNav extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            priority: PropTypes.number,
            title: PropTypes.string,
            menu: PropTypes.object,
        }))
    };

    static defaultProps = {
        items: [],
    };

    constructor(props) {
        super(props);
    }


    render() {
        const {items} = this.props;
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
        );
    }
}

const mapStateToProps = ({app, customer}) => {
    const {items} = customer.company === 'chums'
        ? app.productMenu
        : app.productMenuBC
    return {items};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSubNav)
