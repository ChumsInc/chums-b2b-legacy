import React from 'react';
import classNames from 'classnames';

const CategorySection = ({title, description, className = ''}) => {

    const sectionClassName = {
        'category-section': /col/i.test(className) === false,
    };
    return (
        <div className={classNames(className, sectionClassName)}>
            <h2>{title}</h2>
            <div>{description}</div>
        </div>
    )
}

export default CategorySection;
