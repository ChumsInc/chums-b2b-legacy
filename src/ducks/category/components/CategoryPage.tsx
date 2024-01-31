import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {loadCategory} from '../actions';
import CategoryPageElement from "./CategoryPageElement";
import DocumentTitle from "../../../components/DocumentTitle";
import {useAppDispatch} from "../../../app/configureStore";
import {selectCategory, selectCategoryLoading} from "../selectors";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";

const CategoryPage = ({keyword}: {
    keyword: string;
}) => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectCategoryLoading);
    const category = useSelector(selectCategory);

    useEffect(() => {
        dispatch(loadCategory(keyword));
    }, [keyword]);

    if (!category) {
        return (
            <Box>
                {loading && <LinearProgress variant="indeterminate"/>}
            </Box>
        )
    }

    const {title, lifestyle, pageText} = category;
    const children = category.children.filter(cat => !!cat.status).sort((a, b) => a.priority - b.priority);
    return (
        <Box>
            <DocumentTitle documentTitle={title}/>
            <Typography component="h2" variant="h3">{title}</Typography>
            {loading && <LinearProgress variant="indeterminate"/>}
            {!!pageText && <Box dangerouslySetInnerHTML={{__html: pageText}}/>}
            <Grid2 spacing="3" sx={{justifyContent: children.length < 4 ? 'center' : undefined}} container>
                {children
                    .filter(child => !!child.status)
                    .sort((a, b) => a.priority - b.priority)
                    .map(child => (
                        <CategoryPageElement key={child.id} item={child}/>
                    ))}
            </Grid2>
        </Box>
    )
}

export default CategoryPage;
