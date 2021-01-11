import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SignUpCustomer from "./SignUpCustomer";
import {Redirect} from "react-router-dom";
import {PATH_HOME, PATH_SET_PASSWORD, DOCUMENT_TITLES} from "../constants/paths";
import Alert from "../common-components/Alert";
import {parse as parseQueryString} from "query-string";
import {setDocumentTitle} from '../actions/app';
import SignupNewCustomer from "./SignupNewCustomer";
import MAPPolicy from "./MAPPolicy";
import UsagePolicy from "./UsagePolicy";


class SignUp extends Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        documentTitle: PropTypes.string,
        setDocumentTitle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loggedIn: false,
    };

    componentDidMount() {
        const {h: hash, key} = parseQueryString(document.location.search || '');
        if (!!hash && !!key) {
            this.props.history.push(PATH_SET_PASSWORD + document.location.search);
        }
        if (this.props.documentTitle !== DOCUMENT_TITLES.signUp) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.signUp);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.documentTitle !== DOCUMENT_TITLES.signUp) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.signUp);
        }
    }


    render() {
        const {loggedIn} = this.props;
        if (!!loggedIn) {
            return (<Redirect to={PATH_HOME} />)
        }

        return (
            <div>
                <h2>Sign Up</h2>
                <div className="row">
                    <div className="col-md-6">
                        <UsagePolicy/>
                        <MAPPolicy />
                    </div>
                    <div className="col-md-6">
                        <SignUpCustomer />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({user, app}) => {
    const {loggedIn} = user;
    const {documentTitle} = app;
    return {loggedIn, documentTitle};
};

const mapDispatchToProps = {
    setDocumentTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp) 
