import React from 'react';
import TextArea from "../common-components/TextArea";

const OrderCommentInput = ({value, onChange, onSubmit}) => {
    return (
        <div className="input-group input-group-sm">
            <TextArea value={value}
                      onChange={({value}) => onChange(value)}
                      placeholder="Add any order comments here"
                      style={{overflow: 'hidden'}}
                      className="cart-comment"/>
            <div className="input-group-append">
                <button className="btn btn-sm btn-outline-secondary" onClick={onSubmit}
                        disabled={value.trim().length === 0} >
                    Add Comment <span className="material-icons">create</span>
                </button>
            </div>
        </div>
    )
};

export default OrderCommentInput;
