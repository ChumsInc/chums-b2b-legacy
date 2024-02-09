import React from 'react';
import HomeSlideSet from "../ducks/slides/components/HomeSlideSet";
import {DOCUMENT_TITLES} from "../constants/paths";
import DocumentTitle from "./DocumentTitle";

const HomeV2 = () => {
    return (
        <div>
            <DocumentTitle documentTitle={DOCUMENT_TITLES.home}/>
            <HomeSlideSet/>
        </div>
    )
}
export default HomeV2;
