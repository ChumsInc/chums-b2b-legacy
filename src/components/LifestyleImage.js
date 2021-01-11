import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';


class LifestyleImage extends PureComponent {
    static propTypes = {
        lifestyle: PropTypes.string,
    };

    static defaultProps = {
        lifestyle: null,
    };

    render() {
        const {lifestyle} = this.props;
        return (
            <div className="lifestyle-image">
                {!!lifestyle && <img src={lifestyle} alt="Chums Lifestyle"/>}
            </div>
        );
    }
}

const mapStateToProps = ({app}) => {
    const {lifestyle} = app;
    return {lifestyle};
};
export default connect(mapStateToProps)(LifestyleImage);
