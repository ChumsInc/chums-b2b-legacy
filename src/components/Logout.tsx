import React, {useEffect} from 'react';
import {useAppDispatch} from "../app/configureStore";
import {logout} from "../ducks/user/actions";
import {useNavigate} from "react-router";

const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logout())
            .then(() => {
                navigate('/login');
            })
    }, [dispatch, navigate]);

    return (
        <div>Logging out.</div>
    );
}

export default Logout;
