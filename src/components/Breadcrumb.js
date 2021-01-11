import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import PropType from 'prop-types';
import {locationPathType, pathListPropType} from "../constants/myPropTypes";


const BreadcrumbItem = ({title, pathname, active = false}) => (
    active
        ? <li className="breadcrumb-item active" aria-current="page">{title}</li>
        : <li className="breadcrumb-item"><Link to={pathname}>{title}</Link></li>
);

class Breadcrumb extends Component {
    static propTypes = {
        paths: pathListPropType,
        location: locationPathType,
    };

    static defaultProps = {
        paths: [],
        location: {
            pathname: '',
        },
    };

    render() {
        const {paths, location} = this.props;
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {paths.map(path => <BreadcrumbItem key={path.pathname} {...path} active={path.pathname === location.pathname}/>)}
                </ol>
            </nav>
        );
    }
}

export default withRouter(Breadcrumb);
