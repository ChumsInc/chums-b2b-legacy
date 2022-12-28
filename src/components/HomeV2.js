import React from 'react';
import HomeSlides from "./HomeSlides";
import {DOCUMENT_TITLES} from "../constants/paths";
import DocumentTitle from "./DocumentTitle";

const HomeV2 = () => {
    return (
        <div>
            <DocumentTitle documentTitle={DOCUMENT_TITLES.home}/>
            <HomeSlides/>
        </div>
    )
}
export default HomeV2;
