import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchCategory} from '../actions/category';
import {setLifestyle} from '../actions/app';
import CategoryPageElement from "./CategoryPageElement";
import DocumentTitle from "./DocumentTitle";

class CategoryPage extends Component {

    static propTypes = {
        keyword: PropTypes.string,
        title: PropTypes.string,
        pageText: PropTypes.string,
        lifestyle: PropTypes.string,
        children: PropTypes.array,
        loading: PropTypes.bool,
        documentTitle: PropTypes.string,
        appLifestyle: PropTypes.string,

        fetchCategory: PropTypes.func.isRequired,
        setLifestyle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        keyword: '',
        title: '',
        pageText: '',
        lifestyle: null,
        children: [],
        loading: false,
        documentTitle: '',
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.fetchCategory();
    }

    componentDidUpdate(prevProps) {
        const {keyword, loading, documentTitle, title, lifestyle, appLifestyle} = this.props;
        if (prevProps.keyword !== keyword) {
            this.fetchCategory();
            return;
        }

        if (lifestyle !== prevProps.lifestyle && lifestyle !== appLifestyle) {
            this.props.setLifestyle(lifestyle);
        }
    }


    fetchCategory() {
        this.props.fetchCategory(this.props.keyword);
    }

    render() {
        const {title, keyword, lifestyle, loading, children, pageText} = this.props;
        return (
            <div className="category-panel">
                <DocumentTitle documentTitle={title} />
                <h2>{title}</h2>
                {!!pageText && <div dangerouslySetInnerHTML={{__html: pageText}}/>}
                <div className="row">
                    {children
                        .filter(child => !!child.status)
                        .sort((a, b) => a.priority - b.priority)
                        .map(child => (
                            <CategoryPageElement key={child.id}
                                                 itemType={child.itemType}
                                                 title={child.sectionTitle || child.title}
                                                 description={child.sectionDescription || child.description}
                                                 imageUrl={child.imageUrl}
                                                 category={child.category}
                                                 product={child.product}
                                                 className={child.className}/>
                        ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({category, app}) => {
    const {id, title, pageText, lifestyle, children, loading} = category;
    const {documentTitle, lifestyle: appLifestyle} = app;
    return {id, title, pageText, lifestyle, children, loading, documentTitle, appLifestyle};
};

const mapDispatchToProps = {
    fetchCategory,
    setLifestyle,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);
