import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {useAppDispatch} from "../app/configureStore";
import {loadSlides, selectSlides, selectSlidesLoaded} from "../ducks/slides";


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

const HomeSlides = () => {
    const dispatch = useAppDispatch();
    const slides = useSelector(selectSlides);
    const loaded = useSelector(selectSlidesLoaded);
    useEffect(() => {
        if (!loaded) {
            dispatch(loadSlides())
        }
    }, [loaded]);

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

export default HomeSlides;
