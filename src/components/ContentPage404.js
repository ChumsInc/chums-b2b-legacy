import React from 'react';

const ContentPage404 = ({}) => {
    return (
        <div className="row g-3 align-items-center" >
            <div className="col-sm-6">
                <div className="alert alert-warning">
                    <p>It looks like the page you were looking for can't be found.</p>
                    <p>If you're looking for a product, browse our products listing.</p>
                </div>
            </div>
            <div className="col-sm-6">
                <img src="/images/chums/404-Booby.gif" style={{'max-width':"100%", height: "auto", 'max-height': '50vh'}} alt="Page not found"/>
            </div>
        </div>
    )
}

export default ContentPage404;
