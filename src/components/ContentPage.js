import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {contentPageShape} from "../constants/myPropTypes";
import {fetchPage} from '../actions/page';
import ProgressBar from "./ProgressBar";
import ContentPage404 from "./ContentPage404";
import {setLifestyle, setDocumentTitle} from '../actions/app';

class ContentPage extends Component {
    static propTypes = {
        keyword: contentPageShape.keyword,
        title: contentPageShape.title,
        content: contentPageShape.content,
        lifestyle: contentPageShape.lifestyle,
        appLifestyle: contentPageShape.lifestyle,
        documentTitle: PropTypes.string,

        loading: PropTypes.bool,
        match: PropTypes.shape({
            params: PropTypes.shape({
                keyword: PropTypes.string,
            }),
        }),
        fetchPage: PropTypes.func.isRequired,
        setLifestyle: PropTypes.func.isRequired,
        setDocumentTitle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        keyword: '',
        title: '',
        content: '',
        lifestyle: '',
        loading: false,
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const {match, keyword, lifestyle, appLifestyle, loading, documentTitle, title} = this.props;
        if (match.params.keyword !== keyword) {
            this.props.fetchPage(match.params.keyword);
        }
        if (!loading && lifestyle !== appLifestyle) {
            this.props.setLifestyle(lifestyle);
        }
        if (!loading && documentTitle !== title) {
            this.props.setDocumentTitle(title);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {match, keyword, loading, lifestyle, appLifestyle, documentTitle, title} = this.props;
        if (match.params.keyword !== keyword && !loading) {
            this.props.fetchPage(match.params.keyword);
            return;
        }
        if (!loading && lifestyle !== appLifestyle) {
            this.props.setLifestyle(lifestyle);
        }
        if (!loading && documentTitle !== title) {
            this.props.setDocumentTitle(title);
        }
    }


    render() {
        const {loading, keyword, title, content, status} = this.props;
        return (
            <div className={'page-' + keyword}>
                <h1>{title || (!!loading ? 'Loading' : '')}</h1>
                {!!loading && <ProgressBar striped={true} />}
                {status === 404 && <ContentPage404/>}
                <div dangerouslySetInnerHTML={{__html: content}}/>
            </div>
        );
    }
}

const mapStateToProps = ({page, app}) => {
    const {content, loading} = page;
    const {lifestyle: appLifestyle, documentTitle} = app;
    return {loading, ...content, appLifestyle, documentTitle};
};

const mapDispatchToProps = {
    fetchPage,
    setLifestyle,
    setDocumentTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage) 
