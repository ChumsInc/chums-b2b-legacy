import React from 'react';
import {useParams} from "react-router";
import {useAppSelector} from "../app/configureStore";
import {selectCategory} from "../ducks/category/selectors";


const LifestyleImage = () => {
    const params = useParams();
    const category = useAppSelector(selectCategory);
    if (!category || category.keyword !== params.category) {
        return null;
    }
    if (!category.lifestyle) {
        return null;
    }
    return (
        <div className="lifestyle-image">
            <img src={category.lifestyle} alt="Chums Lifestyle"/>
        </div>
    );
}

export default LifestyleImage;
