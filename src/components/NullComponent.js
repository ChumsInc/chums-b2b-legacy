import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class NullComponent extends Component {
    static propTypes = {};

    static defaultProps = {};

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate()', {});
    }


    render() {
        return null;
    }
}
