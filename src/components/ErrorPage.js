/**
 * Created by steve on 8/31/2016.
 */

import React, { Component } from 'react';

export default class ErrorPage extends Component {
    render() {
        return (
            <div>
                The page {this.props.location.pathname} does not exist.
            </div>
        );
    }
}