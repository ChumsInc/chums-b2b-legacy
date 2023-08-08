import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import DocumentTitle from "../../components/DocumentTitle";
import {useAppDispatch} from "../../app/configureStore";
import {selectPageContent, selectPageLoading} from "./index";
import {useParams} from "react-router";
import {loadPage} from "./actions";
import LinearProgress from "@mui/material/LinearProgress";

const ContentPage = () => {
    const dispatch = useAppDispatch();
    const content = useSelector(selectPageContent);
    const loading = useSelector(selectPageLoading);
    const params = useParams<{ keyword: string }>();

    useEffect(() => {
        if (!loading && !!params.keyword && params.keyword !== content?.keyword) {
            dispatch(loadPage(params.keyword))
        }
    }, [params, content, loading]);

    if (!content) {
        return (
            <div>
                {loading && <LinearProgress variant="indeterminate"/>}
            </div>
        )
    }

    const documentTitle = `${loading ? 'Loading: ' : ''}${content.title ?? params.keyword}`;
    return (
        <div className={'page-' + content?.keyword}>
            <DocumentTitle documentTitle={documentTitle}/>
            <h1>{content.title}</h1>
            {loading && <LinearProgress variant="indeterminate"/>}
            <div dangerouslySetInnerHTML={{__html: content.content ?? ''}}/>
        </div>
    )
}
export default ContentPage;
