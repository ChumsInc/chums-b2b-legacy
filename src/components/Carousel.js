/**
 * Created by steve on 1/30/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {buildPath} from "../utils/fetch";
import {CONTENT_PATH_PRODUCT_IMAGE} from "../constants/paths";


const SCROLL_RIGHT = -1;
const SCROLL_LEFT = 1;
const TRANSFORM_DURATION = 0;
const SLIDE_DURATION = 5000;

const CarouselClassName = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item'
};


const CarouselIndicator = ({index, active, onClick, children}) => (
    <button type="button" className={classNames('carousel-indicator', {active})}
            onClick={() => onClick(index)}>
        {children}
    </button>);


const CarouselIndicators = ({images, active, onClick}) => (
    <div className="carousel-indicators">
        {images.map((img, index) => (
            <CarouselIndicator key={index} index={index} active={active === index} onClick={(id) => onClick(id)}>
                <img src={buildPath(CONTENT_PATH_PRODUCT_IMAGE, {size: '80', image: img})} width="80" height="80"/>
            </CarouselIndicator>
        ))}
    </div>
);

const CarouselImage = ({filename, active, isNext, isPrev, direction, title}) => {
    const className = classNames({
        [CarouselClassName.ITEM]: true,
        [CarouselClassName.ACTIVE]: active,
        [CarouselClassName.RIGHT]: (active || isNext || isPrev) && direction === SCROLL_RIGHT,
        [CarouselClassName.LEFT]: (active || isNext || isPrev) && direction === SCROLL_LEFT,
        [CarouselClassName.NEXT]: isNext,
        [CarouselClassName.PREV]: isPrev,
    });
    const src = buildPath(CONTENT_PATH_PRODUCT_IMAGE, {size: '800', image: filename || 'missing.png'});
    return (<div className={classNames(className)}>
        <img src={src} className="main-image" alt={src} title={title} width="800" height="800"/>
    </div>)
};

export default class Carousel extends Component {
    static propTypes = {
        mainImage: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.shape({
            image: PropTypes.string,
            priority: PropTypes.number,
            status: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        })),
        productId: PropTypes.number,
    };

    static defaultProps = {
        images: [],
        productId: 0,
    };

    state = {
        active: 0,
        next: null,
        prev: null,
        direction: SCROLL_LEFT,
        scrolling: false
    };

    scrollTimer = null;
    transformTimer = null;

    constructor(props) {
        super(props);
        this.move = this.move.bind(this);
        this.scrollByTimer = this.scrollByTimer.bind(this);
        this.scrollFinished = this.scrollFinished.bind(this);
        this.onClickIndicator = this.onClickIndicator.bind(this);
    }

    componentDidMount() {
        this.scrollByTimer();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.mainImage !== prevProps.mainImage) {
            this.move(0);
        }
    }


    componentWillUnmount() {
        clearTimeout(this.scrollTimer);
        clearTimeout(this.transformTimer);
    }

    scrollFinished() {
        const {next} = this.state;
        this.setState({scrolling: false, active: next, next: null, prev: null}, this.scrollByTimer)
    }

    scrollByTimer() {
        clearTimeout(this.transformTimer);
        this.transformTimer = null;
        this.scrollTimer = setTimeout(this.move, SLIDE_DURATION, 'next');
    }

    moveNext() {
        const {active} = this.state;
        const count = this.props.images.length + 1;
        const next = active === count - 1 ? 0 : active + 1;
        const prev = active === 0 ? count - 1 : active - 1;
        const scrolling = true;
    }

    move(option) {
        clearTimeout(this.transformTimer);
        this.transformTimer = null;

        const {active} = this.state;
        const count = this.props.images.length + 1;
        let next = null,
            prev = null;
        let direction = SCROLL_LEFT;
        let scrolling = false;
        switch (option) {
        case 'next':
            next = active === count - 1 ? 0 : active + 1;
            // prev = active === 0 ? count - 1 : active - 1;
            scrolling = true;
            break;
        case 'prev':
            next = active === 0 ? count - 1 : active - 1;
            // prev = active === count - 1 ? 0 : active + 1;
            scrolling = true;
            break;
        case 'pause':
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
                this.scrollTimer = null;
                this.setState({next, prev, scrolling});
                return;
            } else {
                this.scrollByTimer();
            }
            break;
        default:
            if (typeof option === 'number' && option < count && option >= 0) {
                next = option;
                scrolling = true;
            }
        }
        if (scrolling) {
            clearTimeout(this.scrollTimer);
            this.scrollTimer = null;
            this.setState({next, prev, scrolling}, () => {
                this.transformTimer = setTimeout(this.scrollFinished, TRANSFORM_DURATION);
            })
        }
    }

    onClickIndicator(id) {
        this.move(id);
    }

    onClickPrev() {
        this.move('prev');
    }

    onClickNext() {
        this.move('next');
    }

    render() {
        const {mainImage, images = []} = this.props;
        const {active, direction, next, prev, scrolling} = this.state;

        const imageList = [
            mainImage,
            ...images.filter(img => !!img.status).sort((a, b) => a.priority - b.priority).map(img => img.image)
        ];
        return (
            <div className="carousel slide carousel-fade">
                {/* carousel indicators */}
                <div className="carousel-inner">
                    {imageList.map((img, index) => (
                        <CarouselImage key={index} title={""} active={active === index} filename={img}
                                       isNext={next === index} isPrev={prev === index}
                                       direction={scrolling ? direction : null}/>)
                    )}
                </div>

                <a className="carousel-control-prev" role="button" onClick={this.onClickPrev.bind(this)}>
                    <span className="carousel-control-prev-icon" aria-hidden="true"/>
                </a>
                <a className="carousel-control-next" role="button" onClick={this.onClickNext.bind(this)}>
                    <span className="carousel-control-next-icon" aria-hidden="true"/>
                </a>
                <CarouselIndicators images={imageList} active={active} onClick={this.onClickIndicator}/>

            </div>
        )
    }
}

/*
flow:
    1) carousel-item.active => active.carousel-item-left => carousel-item
    2) carousel-item => carousel-item.carousel-item-next.carousel-item-left => carousel-item.active
 */
