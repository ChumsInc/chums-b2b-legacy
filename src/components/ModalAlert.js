/**
 * Created by steve on 1/11/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ModalAlert extends Component {
    static propTypes = {
        title: PropTypes.string,
        body: PropTypes.any,
        footer: PropTypes.any,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),

        onClose: PropTypes.func.isRequired,
        renderFooter: PropTypes.func,
    };

    static defaultProps = {
        title: 'Oh Snap!',
        size: 'md',
    };

    state = {
        show: false,
    };

    constructor(props) {
        super(props);
        // this.handleClickOutside = this.handleClickOutside.bind(this);
        this.close = this.close.bind(this);
        this.onClickInside = this.onClickInside.bind(this);
        this.listenEscape = this.listenEscape.bind(this);
    }

    componentDidMount() {
        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.addEventListener('keydown', this.listenEscape);
        document.body.appendChild(backdrop);
        setTimeout(() => {
            this.setState({show: true});
        }, 0);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.listenEscape);
        const [el] = document.getElementsByClassName('modal-backdrop');
        if (el) {
            el.remove();
        }
    }

    listenEscape(ev) {
        if (ev.code === 'Escape') {
            ev.preventDefault();
            this.close();
        }
    }

    close() {
        this.setState({show: false}, () => {
            setTimeout(this.props.onClose, 150);
            const [el] = document.getElementsByClassName('modal-backdrop');
            if (el) {
                el.classList.remove('show');
            }
        })
    }


    onClickInside(ev) {
        ev.stopPropagation();
        // really, this does nothing but stop it from propagating to the parent objects
    }

    onClickOK(ev) {
        ev.stopPropagation();
        this.close();
    }

    render() {
        const {title, body, footer, children, size} = this.props;
        const {show} = this.state;
        const dialogClassName = {
            'modal-dialog': true,
            'modal-sm': size === 'sm',
            'modal-lg': size === 'lg',
        };

        return (
            <div className={classNames("modal fade", {show})} role="dialog" tabIndex={-1} style={{display: 'block'}}
                 onClick={this.close}>
                <div className={classNames(dialogClassName)} role="document" onClick={this.onClickInside}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={this.close}>
                                <span aria-hidden={true}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {children || body || 'Hey! Something happened'}
                        </div>
                        {!!footer && <div className="modal-footer">{footer}</div>}
                    </div>
                </div>
            </div>
        )
    }
}


