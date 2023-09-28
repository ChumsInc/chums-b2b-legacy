import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import DocumentTitle from "../../components/DocumentTitle";
import {useAppDispatch} from "../../app/configureStore";
import {selectPageContent, selectPageKeyword, selectPageLoaded, selectPageLoading} from "./index";
import {useParams} from "react-router";
import {loadPage} from "./actions";
import LinearProgress from "@mui/material/LinearProgress";
import ContentPage404 from "../../components/ContentPage404";

const ContentPage = () => {
    const dispatch = useAppDispatch();
    const content = useSelector(selectPageContent);
    const keyword = useSelector(selectPageKeyword);
    const loading = useSelector(selectPageLoading);
    const loaded = useSelector(selectPageLoaded);
    const params = useParams<{ keyword: string }>();

    useEffect(() => {
        if (!loading && !!params.keyword && params.keyword !== keyword) {
            dispatch(loadPage(params.keyword))
            return;
        }

    }, [params, keyword, loading, loaded]);

    if (!content && loading) {
        return (
            <div>
                <LinearProgress variant="indeterminate"/>
            </div>
        )
    }
    if (!content && !loading && loaded) {
        return (
            <ContentPage404 />
        )
    }

    const documentTitle = `${loading ? 'Loading: ' : ''}${content?.title ?? params.keyword}`;
    return (
        <div className={'page-' + content?.keyword}>
            <DocumentTitle documentTitle={documentTitle}/>
            <h1>{content?.title}</h1>
            {loading && <LinearProgress variant="indeterminate"/>}
            <div dangerouslySetInnerHTML={{__html: content?.content ?? ''}}/>
        </div>
    )
}
export default ContentPage;
