import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {fetchSlides} from '../actions/app';


const HomeSlide = ({className, mainImage, title, actionURL, mainOverlay, cssClass, target = ''}) => {
    const overlayClass = {
        'slide--has-overlay': (!!mainOverlay && !!mainImage) || !!mainImage,
        'slide--has-image': !!mainImage,
    };
    const bgStyle = {
        'backgroundImage': `url(${mainImage})`,
    };
    if (target === '_blank') {
        return (
            <a href={actionURL} style={bgStyle} className={classNames("slide", className, cssClass, overlayClass)}
               target="_blank">
                {!!mainOverlay && (
                    <div className="overlay" dangerouslySetInnerHTML={{__html: mainOverlay}}/>
                )}
            </a>
        )
    }
    /**
     * @TODO use window.matchMedia('screen and (min-width: 1500px)') (or different sizes) to test responsive sized background images.
     */
    return (
        <Link className={classNames("slide", className, cssClass, overlayClass)} to={actionURL} style={bgStyle}>
            {!!mainOverlay && (
                <div className="overlay" dangerouslySetInnerHTML={{__html: mainOverlay}}/>
            )}
        </Link>
    )
};

const mapStateToProps = ({app}) => {
    const {slides} = app;
    return {
        slides
    };
};

const mapDispatchToProps = {
    fetchSlides,
};

class HomeSlides extends Component {
    static propTypes = {
        slides: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            title: PropTypes.string,
            mainImage: PropTypes.string,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            cssClass: PropTypes.string,
            actionURL: PropTypes.string,
            status: PropTypes.bool,
            priority: PropTypes.number,
            mainOverlay: PropTypes.string,
            responsive: PropTypes.bool,
            sizes: PropTypes.arrayOf(PropTypes.string),
            target: PropTypes.oneOf(['', '_blank']),
        })),
        fetchSlides: PropTypes.func.isRequired,
    };

    static defaultProps = {
        slides: []
    };

    componentDidMount() {
        this.props.fetchSlides();
    }


    render() {
        const slides = this.props.slides.sort((a, b) => a.priority - b.priority);
        return (
            <div className="home-slides">
                {slides[0] && <HomeSlide className="slide-0" {...slides[0]}/>}
                <div className="slide-4-grid-container">
                    {slides[1] && <HomeSlide className="slide-1" {...slides[1]}/>}
                    {slides[2] && <HomeSlide className="slide-2" {...slides[2]} />}
                    {slides[3] && <HomeSlide className="slide-3" {...slides[3]} />}
                </div>
                {slides[4] && <HomeSlide className="slide-0" {...slides[4]}/>}
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeSlides) 
