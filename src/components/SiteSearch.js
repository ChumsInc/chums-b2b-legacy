import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {getSearchResults, setSearchTerm, showSearch} from "../actions/app";
import {connect} from 'react-redux';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import ProgressBar from "./ProgressBar";
import {Link, withRouter} from 'react-router-dom';
import {buildPath} from "../utils/fetch";
import {CONTENT_PATH_SEARCH_IMAGE, PATH_CATEGORY, PATH_PRODUCT} from "../constants/paths";

const itemLink = ({parent, keyword}) => {
    return !!parent
        ? buildPath(PATH_PRODUCT, {category: parent, product: keyword})
        : buildPath(PATH_CATEGORY, {category: keyword});
}

const SearchPlaceholder = ({onClick}) => {
    return (
        <div onClick={() => onClick()}>
            <div className="material-icons">search</div>
        </div>
    );
};

const SearchInput = ({value, inputRef, onChange, hidden = false, onKeyPress, onFocus}) => {
    const style = {display: hidden ? 'none' : undefined};
    return (
        <input type="search" className={classNames("form-control form-control-sm ml-1", {hidden})}
               placeholder="SEARCH" ref={inputRef}
               value={value}
               onChange={(ev) => onChange(ev.target.value)}
               onKeyDown={onKeyPress}
               onFocus={onFocus}
               onClick={onFocus}
        />
    );
};

const SearchResult = ({active, keyword, parent, title, image = 'missing.png', pagetype = '', additional_data = {}, onClick}) => {
    const src = buildPath(CONTENT_PATH_SEARCH_IMAGE, {image: image || 'missing.png'});
    const link = itemLink({parent, keyword});
    return (
        <div className={classNames({'dropdown-item': true, active})} onClick={onClick}>
            <Link to={link} className="search-result">
                <div className="image-container">
                    {!!image && <img src={src} alt={keyword} className="img-fluid"/>}
                </div>
                <div className="text-container">
                    <div>{title}</div>
                    <small>{additional_data.subtitle || ''}</small>
                    <small>{pagetype}</small>
                </div>
            </Link>
        </div>
    )
};


const mapStateToProps = (state) => {
    const {term, loading, results, show} = state.app.search;
    return {term, loading, results, show};
};

const mapDispatchToProps = {
    setSearchTerm,
    getSearchResults,
    showSearch,
};

class SiteSearch extends Component {
    static propTypes = {
        term: PropTypes.string.isRequired,
        results: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        show: PropTypes.bool.isRequired,
        setSearchTerm: PropTypes.func.isRequired,
        getSearchResults: PropTypes.func.isRequired,
        showSearch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        term: '',
        results: [],
        loading: false,
        show: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            showDropDown: false,
            currentItem: 0
        };
        this.onClickSearchIcon = this.onClickSearchIcon.bind(this);
        this.setSearchTerm = this.setSearchTerm.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getSearchResults = debounce(this.getSearchResults.bind(this), 350);
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.childRef = React.createRef();
        this.onKeyPress = this.onKeyPress.bind(this);
        this.close = this.close.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.closeTimer = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {results, loading, term} = this.props;
        const {showDropDown} = this.state;
        if (!showDropDown && (loading || term !== prevProps.term)) {
            this.setState({showDropDown: true});
        }
    }

    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }

    handleClickOutside(ev) {
        console.log('handleClickOutside');
        this.close();
    }

    onClickSearchIcon() {
        this.setState({showInput: true}, () => {
            this.childRef.current.focus();
        });
    }

    setSearchTerm(value) {
        this.props.setSearchTerm(value);
        this.getSearchResults(value)
    }

    getSearchResults(value) {
        this.props.getSearchResults(value);
    }

    close() {
        this.setState({showInput: false});
        this.props.showSearch(false);
    }

    onClick() {
        this.closeTimer = setTimeout(() => this.close(), 50);
    }

    onMove(index) {
        const {results} = this.props;
        if (index > results.length - 1) {
            index = results.length - 1;
        } else if (index < 0) {
            index = 0;
        }
        this.setState({currentItem: index});
    }

    onNext() {
        const {currentItem} = this.state;
        this.onMove(currentItem + 1);
    }

    onPrev() {
        const {currentItem} = this.state;
        this.onMove(currentItem - 1);

    }

    onSelect() {
        const {currentItem} = this.state;
        const {results, history} = this.props;
        console.log(currentItem, results[currentItem]);
        const item = results[currentItem];
        if (item) {
            history.push(itemLink(item));
        }
        this.close();
    }

    onKeyPress(ev) {
        const {results, show} = this.props;
        console.log('onKeyPress', ev.key);
        switch (ev.key) {
        case 'Enter':
            if (results.length && !show) {
                this.props.showSearch(true);
                return;
            }
            ev.preventDefault();
            return this.onSelect();
        case 'ArrowDown':
        case 'Down':
            ev.preventDefault();
            if (results.length && !show) {
                this.props.showSearch(true);
                return;
            }
            return this.onNext();
        case 'ArrowUp':
        case 'Up':
            if (results.length && !show) {
                this.props.showSearch(true);
                return;
            }
            ev.preventDefault();
            return this.onPrev();
        case 'Escape':
        case 'Esc':
            ev.preventDefault();
            return this.close();
        }
    }

    render() {
        const {showInput, showDropDown, currentItem} = this.state;
        const {term, results, loading, show} = this.props;
        return (
            <Fragment>
                <div className="global-search-padder"/>
                <div className="global-search-container">
                    <div className="form-inline">
                        <div className="form-group search-input">
                            <SearchPlaceholder onClick={this.onClickSearchIcon}/>
                            <SearchInput value={term} onChange={this.setSearchTerm}
                                         inputRef={this.childRef} hidden={!showInput}
                                         onFocus={this.onClickSearchIcon}
                                         onKeyPress={this.onKeyPress}/>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        {!!showInput && (
                            <div className={classNames("dropdown-menu fade", {show: show})}>
                                {!!loading && <ProgressBar visible={true} active={true} striped={true}/>}
                                {results.map((item, index) => (
                                    <SearchResult key={item.keyword} {...item}
                                        onClick={this.onClick}
                                        active={index === currentItem}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Fragment>

        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(onClickOutside(SiteSearch)));
