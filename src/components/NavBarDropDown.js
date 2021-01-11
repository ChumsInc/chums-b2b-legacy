import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NavBarDropDownItem from "./NavBarDropDownItem";




export default class NavBarDropDown extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        location: PropTypes.any,
        navs: PropTypes.arrayOf(PropTypes.shape({
            path: PropTypes.string,
            title: PropTypes.string,
            disabled: PropTypes.bool,
        })),
    };

    static defaultProps = {
        title: 'dropdown',
        navs: [],
    };

    state = {
        show: false,
    };

    constructor(props) {
        super(props);
        this.toggleShow = this.toggleShow.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({show: false});
        }
    }


    onClickOutside(ev) {
        document.removeEventListener('click', this.onClickOutside);
        this.setState({show: false});
    }


    toggleShow() {
        const show = !this.state.show;
        if (show) {
            document.addEventListener('click', this.onClickOutside);
        } else {
            document.removeEventListener('click', this.onClickOutside);
        }
        this.setState({show});
    }

    render() {
        const {title, navs} = this.props;
        const {show} = this.state;
        return (
            <div className="nav-item dropdown">
                <div className="nav-link dropdown-toggle" role="button" aria-haspopup={true} aria-expanded={show} onClick={this.toggleShow}>{title}</div>
                <div className={classNames("dropdown-menu", {show})}>
                    {navs.map(({path, title, disabled}, index) => <NavBarDropDownItem key={index} title={title} path={path} disabled={disabled}/>)}
                </div>
            </div>
        );
    }
}


