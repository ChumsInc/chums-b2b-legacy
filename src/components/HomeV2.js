import React, {Component} from 'react';
import HomeSlides from "./HomeSlides";
import {connect} from 'react-redux';
import {fetchPage} from "../actions/page";
import {setDocumentTitle, setLifestyle} from "../actions/app";
import {DOCUMENT_TITLES} from "../constants/paths";


class HomeV2 extends Component {

    componentDidMount() {
        if (this.props.documentTitle !== DOCUMENT_TITLES.home) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.home);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.documentTitle !== DOCUMENT_TITLES.home) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.home);
        }
    }

    render() {
        return (
            <div>
                <HomeSlides />
            </div>

        )
    }
}


const mapStateToProps = ({page, app}) => {
    const {documentTitle} = app;
    return {documentTitle};
};

const mapDispatchToProps = {
    setDocumentTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeV2)
