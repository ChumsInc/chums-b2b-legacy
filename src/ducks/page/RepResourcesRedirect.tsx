import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../user/selectors";
import {PATH_PAGE_RESOURCES} from "../../constants/paths";
import {redirect} from "react-router-dom";

const RepResourcesRedirect = () => {
    const loggedIn = useSelector(selectLoggedIn);

    useEffect(() => {
        if (!loggedIn) {
            redirect(PATH_PAGE_RESOURCES)
            return;
        }
    }, [loggedIn]);

    return null;
}

export default RepResourcesRedirect;
